import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { TMDB_API_KEY } from '../utils/constants'; // Import API key

const FilmSearchResultsPage = ({ onNavigate, searchQuery, setSelectedFilmForAdd, showAlert }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      setSearchError('');
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error("Error fetching movie data from TMDB:", error);
        setSearchError('Failed to fetch search results. Please try again later.');
        showAlert('Failed to fetch search results. Please check your TMDB API key and network connection.');
      } finally {
        setSearchLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, showAlert]);

  const handleFilmSelect = (film) => {
    setSelectedFilmForAdd({
      title: film.title,
      year: film.release_date ? new Date(film.release_date).getFullYear() : 'N/A',
      poster: film.poster_path ? `https://image.tmdb.org/t/p/w200${film.poster_path}` : null,
      description: film.overview || 'No description available.',
    });
    onNavigate('addFilms');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4 pt-24">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 font-inter text-center">
        Pick a Film
      </h1>
      <p className="text-lg text-gray-300 mb-8 max-w-xl text-center font-inter">
        Results from search for "{searchQuery}"
      </p>
        
      <p className='text-lg text-gray-300 mb-8 max-w-xl text-center font-inter'>
        Click on any film to select it
      </p>


      {searchLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <span className="ml-4 text-gray-300 text-xl">Searching for films...</span>
        </div>
      ) : searchError ? (
        <p className="text-red-400 text-center text-xl">{searchError}</p>
      ) : searchResults.length > 0 ? (
        <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700 overflow-y-auto max-h-[60vh]">
          {searchResults.map((film) => (
            <div
              key={film.id}
              className="bg-gray-700 p-6 rounded-lg shadow-xl flex items-center mb-6 last:mb-0 transform hover:scale-[1.02] transition duration-300 cursor-pointer border border-gray-600"
              onClick={() => handleFilmSelect(film)}
            >
              <img
                src={film.poster_path ? `https://image.tmdb.org/t/p/w200${film.poster_path}` : `https://placehold.co/100x150/000000/FFFFFF?text=No+Poster`}
                alt={film.title}
                className="w-28 h-40 object-cover rounded-md mr-6 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x150/000000/FFFFFF?text=No+Poster`; }}
              />
              <div className="flex-grow">
                <h3 className="text-2xl font-semibold text-white mb-2 font-inter">{film.title} ({film.release_date ? new Date(film.release_date).getFullYear() : 'N/A'})</h3>
                <p className="text-gray-300 text-sm font-inter leading-relaxed">
                  {film.overview || 'No description available.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center text-xl">No results found for "{searchQuery}". Try a different title.</p>
      )}
    </div>
  );
};

export default FilmSearchResultsPage;
