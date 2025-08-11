import React, { useState, useEffect } from 'react';

// Import Page Components
import HomePage from './pages/HomePage';
import AddWatchedFilmsPage from './pages/AddWatchedFilmsPage';
import FilmSearchResultsPage from './pages/FilmSearchResultsPage';
import MyWatchedFilmsPage from './pages/MyWatchedFilmsPage';
import FilmDetailsPage from './pages/FilmDetailsPage';

// Import Shared Components
import NavBar from './components/NavBar';
import CustomModal from './components/CustomModal';

// Import Microservices
import { 
  recommendationService, 
  watchlistService, 
  sortingService, 
  wildcardService,
  dataTransformers,
  healthMonitor,
  config
} from './services/microservices';

// Main App component
const App = () => {
  // App state variables
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [watchedFilms, setWatchedFilms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalAction, setModalAction] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilmForAdd, setSelectedFilmForAdd] = useState(null);
  
  // Microservices state
  const [userId] = useState(config.defaultUserId);
  const [servicesHealth, setServicesHealth] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [trendingFilms, setTrendingFilms] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [wildcardSuggestion, setWildcardSuggestion] = useState(null);
  const [isLoadingMicroservices, setIsLoadingMicroservices] = useState(false);

  // Initialize microservices and sync data on app load
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        // Try to load existing film collection from sorting service
        const collectionResult = await sortingService.getFilmCollection(userId);
        
        if (collectionResult.success && collectionResult.watchedFilms) {
          const transformedFilms = dataTransformers.filmsFromMicroservice(collectionResult.watchedFilms);
          setWatchedFilms(transformedFilms);
        }

        // Load watchlist from watchlist service
        const watchlistResult = await watchlistService.getWatchlist(userId);
        if (watchlistResult.success && watchlistResult.films) {
          console.log('Loaded watchlist:', watchlistResult.films); // Debug log
          setWatchlist(watchlistResult.films);
        } else {
          console.log('No watchlist found or error:', watchlistResult); // Debug log
        }

      } catch (error) {
        console.log('Error loading existing data:', error);
      }
    };

    const initializeMicroservices = async () => {
      setIsLoadingMicroservices(true);
      
      try {
        // Check health of all microservices
        const healthResults = await healthMonitor.checkAllServices();
        setServicesHealth(healthResults);
        
        // Initialize user profile in recommendation service
        await recommendationService.createUserProfile(userId, [], []);
        
        // Load existing data from sorting service
        await loadExistingData();
        
        console.log('Microservices initialized successfully');
      } catch (error) {
        console.error('Failed to initialize microservices:', error);
        showAlert('Some features may be limited due to service connectivity issues.');
      } finally {
        setIsLoadingMicroservices(false);
      }
    };

    initializeMicroservices();
  }, [userId]); // Only depend on userId

  // Sync data with microservices whenever watched films change
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const ratedFilms = watchedFilms.filter(film => film.rating > 0);
        
        if (ratedFilms.length >= 5) {
          const recommendationsResult = await recommendationService.getRecommendations(userId, 5);
          if (recommendationsResult.success) {
            setRecommendations(recommendationsResult.recommendations);
          }
        }

        // Load trending films
        const trendingResult = await recommendationService.getTrending();
        if (trendingResult.success) {
          setTrendingFilms(trendingResult.trending);
        }

      } catch (error) {
        console.error('Failed to load recommendations:', error);
      }
    };

    const syncDataWithMicroservices = async () => {
      try {
        // Transform and sync watched films with sorting service
        const transformedFilms = dataTransformers.filmsToMicroservice(watchedFilms);
        await sortingService.updateFilmCollection(userId, transformedFilms, []);

        // Sync ratings with recommendation service for films that have ratings
        for (const film of watchedFilms) {
          if (film.rating && film.rating > 0) {
            await recommendationService.addRating(userId, film.id, film.rating);
          }
        }

        // Load recommendations if user has enough ratings
        await loadRecommendations();
        
      } catch (error) {
        console.error('Failed to sync data with microservices:', error);
      }
    };

    if (watchedFilms.length > 0) {
      syncDataWithMicroservices();
    }
  }, [watchedFilms, userId]); // Include dependencies

  // Enhanced film addition with microservices integration
  const handleAddFilm = async (filmData) => {
    try {
      // Add to local state first
      const newFilm = {
        id: Date.now().toString(),
        title: filmData.title,
        watchedDate: filmData.watchedDate,
        year: filmData.year || new Date().getFullYear(),
        rating: filmData.rating || 0,
        thoughts: filmData.thoughts || '',
        poster: filmData.poster || `https://placehold.co/100x150/000000/FFFFFF?text=${filmData.title.substring(0, Math.min(filmData.title.length, 10))}`,
        description: filmData.description || '',
      };

      setWatchedFilms(prevFilms => [...prevFilms, newFilm]);

      // Add rating to recommendation service if provided
      if (newFilm.rating > 0) {
        await recommendationService.addRating(userId, newFilm.id, newFilm.rating);
      }

      return newFilm;

    } catch (error) {
      console.error('Error adding film:', error);
      throw error;
    }
  };

  // Enhanced film update with microservices integration
  const handleUpdateFilm = async (filmId, updates) => {
    try {
      setWatchedFilms(prevFilms =>
        prevFilms.map(f =>
          f.id === filmId ? { ...f, ...updates } : f
        )
      );

      // Update rating in recommendation service if changed
      if (updates.rating !== undefined) {
        await recommendationService.addRating(userId, filmId, updates.rating);
      }

    } catch (error) {
      console.error('Error updating film:', error);
      throw error;
    }
  };

  // Enhanced film removal with microservices integration
  const handleRemoveFilm = async (filmId) => {
    try {
      setWatchedFilms(prevFilms => prevFilms.filter(f => f.id !== filmId));
      
      // Note: In a real implementation, you might want to remove the rating
      // from the recommendation service as well, but our current API doesn't support this
      
    } catch (error) {
      console.error('Error removing film:', error);
      throw error;
    }
  };

  // Watchlist management functions
  const addToWatchlist = async (filmData) => {
    try {
      const result = await watchlistService.addToWatchlist(userId, filmData);
      if (result.success) {
        showAlert(`"${filmData.title}" added to your watchlist!`);
        // Refresh watchlist
        const watchlistResult = await watchlistService.getWatchlist(userId);
        if (watchlistResult.success) {
          setWatchlist(watchlistResult.films);
        }
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      showAlert('Failed to add film to watchlist. Please try again.');
    }
  };

  const removeFromWatchlist = async (filmId) => {
    try {
      const result = await watchlistService.removeFromWatchlist(userId, filmId);
      if (result.success) {
        showAlert(result.message);
        // Refresh watchlist
        const watchlistResult = await watchlistService.getWatchlist(userId);
        if (watchlistResult.success) {
          setWatchlist(watchlistResult.films);
        }
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      showAlert('Failed to remove film from watchlist. Please try again.');
    }
  };

  // Sorting function using microservice
  const sortFilms = async (criteria, order = 'desc') => {
    try {
      const result = await sortingService.sortFilms(userId, criteria, order, 'watched');
      if (result.success) {
        const transformedFilms = dataTransformers.filmsFromMicroservice(result.sortedFilms);
        setWatchedFilms(transformedFilms);
        showAlert(`Films sorted by ${criteria} (${order})`);
      }
    } catch (error) {
      console.error('Error sorting films:', error);
      showAlert('Failed to sort films. Using local sorting.');
      // Fallback to local sorting
      const sorted = [...watchedFilms].sort((a, b) => {
        if (criteria === 'rating') {
          return order === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        } else if (criteria === 'dateWatched') {
          return order === 'desc' ? 
            new Date(b.watchedDate) - new Date(a.watchedDate) :
            new Date(a.watchedDate) - new Date(b.watchedDate);
        }
        return 0;
      });
      setWatchedFilms(sorted);
    }
  };

  // Wildcard suggestion function
  const loadWildcardSuggestion = async () => {
    try {
      const result = await wildcardService.getWildcardSuggestion();
      if (result.title) { // Basic success check
        setWildcardSuggestion(result);
        showAlert(`Wildcard suggestion: "${result.title}" - ${result.genre}`);
      }
    } catch (error) {
      console.error('Failed to load wildcard suggestion:', error);
      showAlert('Failed to load wildcard suggestion. Please try again.');
    }
  };
  const filterFilms = async (filters) => {
    try {
      const result = await sortingService.filterFilms(userId, filters, 'watched');
      if (result.success) {
        const transformedFilms = dataTransformers.filmsFromMicroservice(result.filteredFilms);
        setWatchedFilms(transformedFilms);
        showAlert(`Found ${result.resultCount} films matching your filters`);
      }
    } catch (error) {
      console.error('Error filtering films:', error);
      showAlert('Failed to filter films. Please try again.');
    }
  };

  // Modal functions (unchanged)
  const showAlert = (msg) => {
    setModalMessage(msg);
    setModalType('alert');
    setShowModal(true);
  };

  const showConfirm = (msg, action) => {
    setModalMessage(msg);
    setModalType('confirm');
    setModalAction(() => action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalAction(null);
  };

  const handleConfirmModal = () => {
    if (modalAction) {
      modalAction();
    }
    handleCloseModal();
  };

  // Navigation functions (unchanged)
  const handleBack = () => {
    if (currentPage === 'filmSearchResults') {
      setCurrentPage('addFilms');
    } else if (currentPage === 'filmDetails') {
      setCurrentPage('watchedFilms');
    } else {
      setCurrentPage('home');
    }
  };

  const showBackButton = currentPage !== 'home';

  // Main rendering logic with enhanced props for microservices
  const renderPage = () => {
    const commonProps = {
      onNavigate: setCurrentPage,
      showAlert,
      showConfirm,
      userId,
      recommendations,
      trendingFilms,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      sortFilms,
      filterFilms,
      loadWildcardSuggestion,
      isLoadingMicroservices
    };

    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            {...commonProps}
            recentlyAddedFilms={watchedFilms}
            setSelectedFilm={setSelectedFilm}
            servicesHealth={servicesHealth}
            wildcardSuggestion={wildcardSuggestion}
          />
        );
      case 'addFilms':
        return (
          <AddWatchedFilmsPage 
            {...commonProps}
            selectedFilmForAdd={selectedFilmForAdd}
            setSelectedFilmForAdd={setSelectedFilmForAdd}
            setWatchedFilms={setWatchedFilms}
            setSearchQuery={setSearchQuery}
            handleAddFilm={handleAddFilm}
          />
        );
      case 'filmSearchResults':
        return (
          <FilmSearchResultsPage 
            {...commonProps}
            searchQuery={searchQuery}
            setSelectedFilmForAdd={setSelectedFilmForAdd}
          />
        );
      case 'watchedFilms':
        return (
          <MyWatchedFilmsPage 
            {...commonProps}
            films={watchedFilms}
            setSelectedFilm={setSelectedFilm}
          />
        );
      case 'filmDetails':
        return (
          <FilmDetailsPage 
            {...commonProps}
            film={selectedFilm}
            setWatchedFilms={setWatchedFilms}
            setSelectedFilm={setSelectedFilm}
            handleUpdateFilm={handleUpdateFilm}
            handleRemoveFilm={handleRemoveFilm}
          />
        );
      default:
        return (
          <HomePage 
            {...commonProps}
            recentlyAddedFilms={watchedFilms}
            setSelectedFilm={setSelectedFilm}
            servicesHealth={servicesHealth}
            wildcardSuggestion={wildcardSuggestion}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 font-inter">
      {/* Loading overlay for microservices initialization */}
      {isLoadingMicroservices && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
              <span className="text-white text-lg">Initializing services...</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for scrollbar etc. */}
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          /* Custom scrollbar for better aesthetics */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #4a5568; /* Tailwind gray-700 */
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background: #a0aec0; /* Tailwind gray-400 */
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #cbd5e0; /* Tailwind gray-300 */
          }
        `}
      </style>

      <NavBar 
        onNavigate={setCurrentPage} 
        showBackButton={showBackButton} 
        onBack={handleBack}
        servicesHealth={servicesHealth}
      />
      {renderPage()}
      <CustomModal
        show={showModal}
        type={modalType}
        message={modalMessage}
        onConfirm={handleConfirmModal}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default App;