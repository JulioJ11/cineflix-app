import React, { useState } from 'react';

// Import Page Components
import HomePage from './pages/HomePage';
import AddWatchedFilmsPage from './pages/AddWatchedFilmsPage';
import FilmSearchResultsPage from './pages/FilmSearchResultsPage';
import MyWatchedFilmsPage from './pages/MyWatchedFilmsPage';
import FilmDetailsPage from './pages/FilmDetailsPage';

// Import Shared Components
import NavBar from './components/NavBar';
import CustomModal from './components/CustomModal';

// Main App component
const App = () => {
  // App state variables
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFilm, setSelectedFilm] = useState(null); // Used for FilmDetailsPage
  const [watchedFilms, setWatchedFilms] = useState([]); // In-memory storage for films
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'confirm' or 'alert'
  const [modalAction, setModalAction] = useState(null); // Function to execute on confirm
  const [modalMessage, setModalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for TMDB search query
  const [selectedFilmForAdd, setSelectedFilmForAdd] = useState(null); // Film selected from TMDB search to add

  // Modal functions
  const showAlert = (msg) => {
    setModalMessage(msg);
    setModalType('alert');
    setShowModal(true);
  };

  const showConfirm = (msg, action) => {
    setModalMessage(msg);
    setModalType('confirm');
    setModalAction(() => action); // Store the function to be called on confirm
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

  // Function to handle back navigation
  const handleBack = () => {
    if (currentPage === 'filmSearchResults') {
      setCurrentPage('addFilms');
    } else if (currentPage === 'filmDetails') {
      setCurrentPage('watchedFilms');
    } else {
      setCurrentPage('home');
    }
  };

  // Determine if back button should be shown
  const showBackButton = currentPage !== 'home';

  // Main rendering logic based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} recentlyAddedFilms={watchedFilms} setSelectedFilm={setSelectedFilm} />;
      case 'addFilms':
        return <AddWatchedFilmsPage onNavigate={setCurrentPage} showAlert={showAlert} selectedFilmForAdd={selectedFilmForAdd} setSelectedFilmForAdd={setSelectedFilmForAdd} setWatchedFilms={setWatchedFilms} setSearchQuery={setSearchQuery} />;
      case 'filmSearchResults':
        return <FilmSearchResultsPage onNavigate={setCurrentPage} searchQuery={searchQuery} setSelectedFilmForAdd={setSelectedFilmForAdd} showAlert={showAlert} />;
      case 'watchedFilms':
        return <MyWatchedFilmsPage onNavigate={setCurrentPage} films={watchedFilms} setSelectedFilm={setSelectedFilm} />;
      case 'filmDetails':
        return <FilmDetailsPage film={selectedFilm} onNavigate={setCurrentPage} showAlert={showAlert} showConfirm={showConfirm} setWatchedFilms={setWatchedFilms} setSelectedFilm={setSelectedFilm} />;
      default:
        return <HomePage onNavigate={setCurrentPage} recentlyAddedFilms={watchedFilms} setSelectedFilm={setSelectedFilm} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 font-inter">
      {/* Tailwind CSS CDN is in public/index.html */}
      {/* Google Fonts is in public/index.html */}

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

      <NavBar onNavigate={setCurrentPage} showBackButton={showBackButton} onBack={handleBack} />
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
