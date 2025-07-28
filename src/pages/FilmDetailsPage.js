import React, { useState, useEffect } from 'react';
import { Loader2, Edit, Trash2, XCircle } from 'lucide-react';
import StarRating from '../components/StarRating'; // Import StarRating component

const FilmDetailsPage = ({ film, onNavigate, showAlert, showConfirm, setWatchedFilms, setSelectedFilm }) => {
  const [localRating, setLocalRating] = useState(film?.rating || 0);
  const [localThoughts, setLocalThoughts] = useState(film?.thoughts || '');
  const [updatingFilm, setUpdatingFilm] = useState(false);
  const [deletingFilm, setDeletingFilm] = useState(false);

  useEffect(() => {
    if (film) {
      setLocalRating(film.rating);
      setLocalThoughts(film.thoughts);
    }
  }, [film]);

  if (!film) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4 pt-24">
        <p className="text-xl text-gray-300 font-inter">No film selected. Please go back to select one.</p>
        <button
          onClick={() => onNavigate('watchedFilms')}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 font-inter text-lg font-semibold"
        >
          Go to My Watched Films
        </button>
      </div>
    );
  }

  const handleUpdate = () => {
    setUpdatingFilm(true);
    try {
      setWatchedFilms(prevFilms =>
        prevFilms.map(f =>
          f.id === film.id ? { ...f, rating: localRating, thoughts: localThoughts } : f
        )
      );
      showAlert('Film details updated successfully!');
      onNavigate('watchedFilms');
    } catch (e) {
      console.error("Error updating film: ", e);
      showAlert(`Failed to update film: ${e.message}`);
    } finally {
      setUpdatingFilm(false);
    }
  };

  const handleRemove = () => {
    showConfirm(`Are you sure you want to remove "${film.title}"? This action cannot be undone.`, () => {
      setDeletingFilm(true);
      try {
        setWatchedFilms(prevFilms => prevFilms.filter(f => f.id !== film.id));
        showAlert('Film removed successfully!');
        setSelectedFilm(null); // Clear selected film
        onNavigate('watchedFilms');
      } catch (e) {
        console.error("Error removing film: ", e);
        showAlert(`Failed to remove film: ${e.message}`);
      } finally {
        setDeletingFilm(false);
      }
    });
  };

  const handleCancel = () => {
    onNavigate('watchedFilms');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4 pt-24">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 font-inter text-center">
        Selected Film
      </h1>
      <p className="text-lg text-gray-300 mb-2 max-w-xl text-center font-inter">
        Changed your mind? Update or remove the film from list.
      </p>
      <p className="text-sm text-gray-400 mb-8 max-w-xl text-center font-inter">
        You can edit the rating/thoughts. Removal will erase all tracked data associated with the film.
      </p>

      <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
          <img
            src={film.poster || `https://placehold.co/100x150/000000/FFFFFF?text=${film.title.substring(0, Math.min(film.title.length, 10))}`}
            alt={film.title}
            className="w-40 h-60 object-cover rounded-lg shadow-lg"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x150/000000/FFFFFF?text=No+Poster`; }}
          />
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-3xl font-semibold text-white mb-3 font-inter">{film.title} ({film.year})</h3>
            <div className="flex items-center justify-center md:justify-start mb-3">
              <span className="text-gray-300 text-xl font-inter mr-2">Rating:</span>
              <StarRating rating={localRating} setRating={setLocalRating} />
            </div>
            <div className="mb-3">
              <label htmlFor="thoughts" className="block text-gray-300 text-lg font-semibold mb-1 font-inter">
                Thoughts:
              </label>
              <textarea
                id="thoughts"
                value={localThoughts}
                onChange={(e) => setLocalThoughts(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter resize-none h-24"
                placeholder="Enter your thoughts about the film..."
              ></textarea>
            </div>
            <p className="text-gray-300 text-md font-inter">Watched Date: {film.watchedDate}</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleUpdate}
            className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-full shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 font-inter text-lg font-semibold"
            disabled={updatingFilm}
          >
            {updatingFilm ? <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" /> : <Edit className="inline-block w-5 h-5 mr-2" />}
            Update
          </button>
          <button
            onClick={handleRemove}
            className="px-6 py-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 font-inter text-lg font-semibold"
            disabled={deletingFilm}
          >
            {deletingFilm ? <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" /> : <Trash2 className="inline-block w-5 h-5 mr-2" />}
            Remove
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 font-inter text-lg font-semibold"
          >
            <XCircle className="inline-block w-5 h-5 mr-2" /> Cancel
          </button>
        </div>
      </div>
    </div>
    );
  };

export default FilmDetailsPage;
