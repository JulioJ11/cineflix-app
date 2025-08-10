import React, { useState, useEffect } from 'react';
import { Filter, SortAsc, SortDesc, Search, X } from 'lucide-react';
import StarRating from '../components/StarRating';

const MyWatchedFilmsPage = ({ 
  onNavigate, 
  films, 
  setSelectedFilm, 
  sortFilms, 
  filterFilms, 
  showAlert,
  userId 
}) => {
  const [sortCriteria, setSortCriteria] = useState('dateWatched');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [genreFilter, setGenreFilter] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Local filtered and sorted films
  const [displayedFilms, setDisplayedFilms] = useState(films);

  useEffect(() => {
    setDisplayedFilms(films);
  }, [films]);

  // Get unique values for filter options
  const getFilterOptions = () => {
    const genres = [...new Set(films.map(f => f.genre).filter(Boolean))].sort();
    const years = [...new Set(films.map(f => f.year).filter(Boolean))].sort((a, b) => b - a);
    const ratings = [...new Set(films.map(f => f.rating).filter(r => r > 0))].sort((a, b) => b - a);
    
    return { genres, years, ratings };
  };

  const { genres, years, ratings } = getFilterOptions();

  // Handle sorting
  const handleSort = async (criteria) => {
    if (criteria === sortCriteria) {
      // If same criteria, toggle order
      const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      setSortOrder(newOrder);
      await applySorting(criteria, newOrder);
    } else {
      // New criteria, default to desc
      setSortCriteria(criteria);
      setSortOrder('desc');
      await applySorting(criteria, 'desc');
    }
  };

  const applySorting = async (criteria, order) => {
    setIsLoading(true);
    try {
      await sortFilms(criteria, order);
    } catch (error) {
      console.error('Sorting failed:', error);
      // Fallback to local sorting
      localSort(criteria, order);
    }
    setIsLoading(false);
  };

  // Local sorting fallback
  const localSort = (criteria, order) => {
    const sorted = [...displayedFilms].sort((a, b) => {
      let aVal, bVal;
      
      switch (criteria) {
        case 'rating':
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        case 'dateWatched':
          aVal = new Date(a.watchedDate);
          bVal = new Date(b.watchedDate);
          break;
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'releaseYear':
          aVal = a.year || 0;
          bVal = b.year || 0;
          break;
        default:
          return 0;
      }
      
      if (order === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      } else {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    });
    
    setDisplayedFilms(sorted);
  };

  // Handle filtering
  const applyFilters = async () => {
    const filters = {};
    
    if (genreFilter) filters.genre = genreFilter;
    if (minRating) filters.minRating = parseInt(minRating);
    if (maxRating) filters.maxRating = parseInt(maxRating);
    if (yearFilter) filters.year = parseInt(yearFilter);

    setActiveFilters(filters);
    setIsLoading(true);

    try {
      if (Object.keys(filters).length > 0) {
        await filterFilms(filters);
      } else {
        // No filters, show all films
        setDisplayedFilms(films);
      }
    } catch (error) {
      console.error('Filtering failed:', error);
      // Fallback to local filtering
      localFilter(filters);
    }
    
    setIsLoading(false);
    setShowFilters(false);
  };

  // Local filtering fallback
  const localFilter = (filters) => {
    let filtered = [...films];

    if (filters.genre) {
      filtered = filtered.filter(film => 
        film.genre && film.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter(film => (film.rating || 0) >= filters.minRating);
    }

    if (filters.maxRating !== undefined) {
      filtered = filtered.filter(film => (film.rating || 0) <= filters.maxRating);
    }

    if (filters.year) {
      filtered = filtered.filter(film => film.year === filters.year);
    }

    setDisplayedFilms(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setGenreFilter('');
    setMinRating('');
    setMaxRating('');
    setYearFilter('');
    setActiveFilters({});
    setDisplayedFilms(films);
    setShowFilters(false);
  };

  // Search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setDisplayedFilms(films);
    } else {
      const searched = films.filter(film =>
        film.title.toLowerCase().includes(term.toLowerCase()) ||
        (film.genre && film.genre.toLowerCase().includes(term.toLowerCase()))
      );
      setDisplayedFilms(searched);
    }
  };

  // Get sort icon
  const getSortIcon = (criteria) => {
    if (sortCriteria === criteria) {
      return sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />;
    }
    return <SortAsc className="w-4 h-4 opacity-50" />;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4 pt-24">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 font-inter text-center">
        My Watched Films
      </h1>
      <p className="text-lg text-gray-300 mb-8 max-w-xl text-center font-inter">
        Your collection of watched films. Click on a film to view details.
      </p>

      {films.length > 0 && (
        <div className="w-full max-w-4xl mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search films..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm font-semibold">Sort by:</span>
              {[
                { key: 'dateWatched', label: 'Date Watched' },
                { key: 'rating', label: 'Rating' },
                { key: 'title', label: 'Title' },
                { key: 'releaseYear', label: 'Year' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-md transition duration-200 ${
                    sortCriteria === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  disabled={isLoading}
                >
                  <span>{label}</span>
                  {getSortIcon(key)}
                </button>
              ))}
            </div>

            {/* Filter Button */}
            <div className="flex items-center space-x-2">
              {Object.keys(activeFilters).length > 0 && (
                <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                  {Object.keys(activeFilters).length} active
                </span>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-200"
                disabled={isLoading}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Filter Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Genre Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Genre</label>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Range */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Min Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating}+ Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Max Rating</label>
                  <select
                    value={maxRating}
                    onChange={(e) => setMaxRating(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Stars</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Release Year</label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition duration-200"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Applying...' : 'Apply Filters'}
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {displayedFilms.length} of {films.length} films
            </span>
            {Object.keys(activeFilters).length > 0 && (
              <button
                onClick={clearFilters}
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Films Grid */}
      {displayedFilms.length > 0 ? (
        <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700 overflow-y-auto max-h-[60vh]">
          {isLoading && (
            <div className="text-center py-4 mb-4">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                <span className="text-gray-300">Processing...</span>
              </div>
            </div>
          )}
          
          {displayedFilms.map((film) => (
            <div
              key={film.id}
              className="bg-gray-700 p-6 rounded-lg shadow-xl flex items-center mb-6 last:mb-0 transform hover:scale-[1.02] transition duration-300 cursor-pointer border border-gray-600"
              onClick={() => {
                setSelectedFilm(film);
                onNavigate('filmDetails');
              }}
            >
              <img
                src={film.poster || `https://placehold.co/100x150/000000/FFFFFF?text=${film.title.substring(0, Math.min(film.title.length, 10))}`}
                alt={film.title}
                className="w-28 h-40 object-cover rounded-md mr-6 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x150/000000/FFFFFF?text=No+Poster`; }}
              />
              <div className="flex-grow">
                <h3 className="text-2xl font-semibold text-white mb-2 font-inter">{film.title} ({film.year})</h3>
                <div className="flex items-center mb-2">
                  <span className="text-gray-300 text-lg font-inter mr-2">Rating:</span>
                  <StarRating rating={film.rating} />
                </div>
                {film.genre && (
                  <p className="text-gray-300 text-sm font-inter mb-1">Genre: {film.genre}</p>
                )}
                <p className="text-gray-300 text-sm font-inter">Watched Date: {film.watchedDate}</p>
                {film.thoughts && (
                  <p className="text-gray-400 text-sm font-inter mt-2 italic">"{film.thoughts}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : films.length > 0 ? (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 font-inter text-xl mb-2">No films match your current filters</p>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filter criteria</p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 font-inter text-lg font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 font-inter text-xl">You haven't logged any films yet. Add one!</p>
          <button
            onClick={() => onNavigate('addFilms')}
            className="mt-6 px-6 py-3 bg-yellow-400 text-gray-900 rounded-full shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200 font-inter text-lg font-semibold"
          >
            Add Your First Film
          </button>
        </div>
      )}
    </div>
  );
};

export default MyWatchedFilmsPage;