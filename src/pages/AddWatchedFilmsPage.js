import React, { useState, useEffect } from 'react';
import { Search, Calendar, Loader2 } from 'lucide-react';
import StarRating from '../components/StarRating'; // Import StarRating component

const AddWatchedFilmsPage = ({ onNavigate, showAlert, selectedFilmForAdd, setSelectedFilmForAdd, setWatchedFilms, setSearchQuery }) => {
  const [localFilmTitle, setLocalFilmTitle] = useState(selectedFilmForAdd?.title || '');
  const [localFilmYear, setLocalFilmYear] = useState(selectedFilmForAdd?.year || '');
  const [localFilmPoster, setLocalFilmPoster] = useState(selectedFilmForAdd?.poster || '');
  const [localFilmDescription, setLocalFilmDescription] = useState(selectedFilmForAdd?.description || '');
  const [localTheaterVisitDate, setLocalTheaterVisitDate] = useState('');
  const [localRating, setLocalRating] = useState(0);
  const [addingFilm, setAddingFilm] = useState(false);
  const [isManualAddMode, setIsManualAddMode] = useState(false);

  useEffect(() => {
    if (selectedFilmForAdd) {
      setLocalFilmTitle(selectedFilmForAdd.title);
      setLocalFilmYear(selectedFilmForAdd.year);
      setLocalFilmPoster(selectedFilmForAdd.poster);
      setLocalFilmDescription(selectedFilmForAdd.description || '');
      setIsManualAddMode(false);
      setLocalRating(0);
      setLocalTheaterVisitDate('');
    }
  }, [selectedFilmForAdd]);

  const handleAddFilm = () => {
    if (!localFilmTitle || !localTheaterVisitDate) {
      showAlert('Please enter both film title and theater visit date.');
      return;
    }

    setAddingFilm(true);
    try {
      const newFilm = {
        id: Date.now().toString(),
        title: localFilmTitle,
        watchedDate: localTheaterVisitDate,
        year: localFilmYear || (localTheaterVisitDate ? new Date(localTheaterVisitDate).getFullYear() : 'N/A'),
        rating: localRating,
        thoughts: '', // Thoughts are added on the details page
        poster: localFilmPoster || `https://placehold.co/100x150/000000/FFFFFF?text=${localFilmTitle.substring(0, Math.min(localFilmTitle.length, 10))}`,
        description: localFilmDescription,
      };
      setWatchedFilms(prevFilms => [...prevFilms, newFilm]);
      showAlert('Film added successfully!');
      setLocalFilmTitle('');
      setLocalFilmYear('');
      setLocalFilmPoster('');
      setLocalFilmDescription('');
      setLocalTheaterVisitDate('');
      setLocalRating(0);
      setSelectedFilmForAdd(null);
      setIsManualAddMode(false);
      onNavigate('watchedFilms');
    } catch (e) {
      console.error("Error adding film: ", e);
      showAlert(`Failed to add film: ${e.message}`);
    } finally {
      setAddingFilm(false);
    }
  };

  const handleManualAddToggle = () => {
    setIsManualAddMode(prevMode => !prevMode);
    if (!isManualAddMode) {
      setSelectedFilmForAdd(null);
      setLocalFilmYear('');
      setLocalFilmPoster('');
      setLocalFilmDescription(''); // Clear description when switching to manual
    } else {
      setLocalFilmDescription('');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4 pt-24">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 font-inter text-center">
        Add Watched Films
      </h1>
      <p className="text-lg text-gray-300 mb-8 max-w-xl text-center font-inter">
        Films are meant to be seen and thought of.
      </p>

      <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="mb-6">
          <label htmlFor="filmTitle" className="block text-gray-300 text-lg font-semibold mb-2 font-inter">
            Film Title:
          </label>
          <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-inner border border-gray-600">
            <input
              type="text"
              id="filmTitle"
              value={localFilmTitle}
              onChange={(e) => setLocalFilmTitle(e.target.value)}
              placeholder={isManualAddMode ? "Enter film title" : "Search"}
              className="flex-grow p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none font-inter text-lg"
            />
            {!isManualAddMode && (
              <button
                onClick={() => {
                  if (localFilmTitle.trim()) {
                    setSearchQuery(localFilmTitle.trim());
                    onNavigate('filmSearchResults');
                  } else {
                    showAlert('Please enter a film title to search.');
                  }
                }}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                aria-label="Search film"
              >
                <Search className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={handleManualAddToggle}
              className={`px-5 py-3 text-white rounded-r-full focus:outline-none focus:ring-2 transition duration-200 ml-2 font-inter text-lg
                ${isManualAddMode ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'}`}
            >
              {isManualAddMode ? 'Back to Search' : 'Manual Add'}
            </button>
          </div>
          {localFilmPoster && !isManualAddMode && (
            <div className="mt-4 flex items-center justify-center">
              <img
                src={localFilmPoster}
                alt="Selected Film Poster"
                className="w-24 h-36 object-cover rounded-md shadow-md border border-gray-600"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x150/000000/FFFFFF?text=No+Poster`; }}
              />
              {localFilmYear && <p className="ml-4 text-gray-300 text-md font-inter">({localFilmYear})</p>}
            </div>
          )}
        </div>

        {isManualAddMode && (
          <>
            <div className="mb-6">
              <label htmlFor="filmYear" className="block text-gray-300 text-lg font-semibold mb-2 font-inter">
                Film Year:
              </label>
              <input
                type="number"
                id="filmYear"
                value={localFilmYear}
                onChange={(e) => setLocalFilmYear(e.target.value)}
                placeholder="e.g., 2023"
                className="w-full p-3 bg-gray-700 text-white rounded-full shadow-inner border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter text-lg"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="filmPoster" className="block text-gray-300 text-lg font-semibold mb-2 font-inter">
                Poster URL:
              </label>
              <input
                type="text"
                id="filmPoster"
                value={localFilmPoster}
                onChange={(e) => setLocalFilmPoster(e.target.value)}
                placeholder="Optional: Enter image URL"
                className="w-full p-3 bg-gray-700 text-white rounded-full shadow-inner border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter text-lg"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="filmDescription" className="block text-gray-300 text-lg font-semibold mb-2 font-inter">
                Description:
              </label>
              <textarea
                id="filmDescription"
                value={localFilmDescription}
                onChange={(e) => setLocalFilmDescription(e.target.value)}
                placeholder="Optional: Enter a brief description"
                className="w-full p-3 bg-gray-700 text-white rounded-md shadow-inner border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter resize-none h-24"
              ></textarea>
            </div>
          </>
        )}

        <div className="mb-6">
          <label className="block text-gray-300 text-lg font-semibold mb-2 font-inter">
            Rating:
          </label>
          <div className="flex items-center justify-center md:justify-start bg-gray-700 p-3 rounded-full shadow-inner border border-gray-600">
            <StarRating rating={localRating} setRating={setLocalRating} />
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="theaterVisitDate" className="block text-gray-300 text-lg font-semibold mb-2 font-inter">
            Theater Visit Date:
          </label>
          <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-inner border border-gray-600">
            <input
              type="date"
              id="theaterVisitDate"
              value={localTheaterVisitDate}
              onChange={(e) => setLocalTheaterVisitDate(e.target.value)}
              className="flex-grow p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none font-inter text-lg"
            />
            <span className="p-3 text-gray-400">
              <Calendar className="w-6 h-6" />
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setLocalFilmTitle('');
              setLocalFilmYear('');
              setLocalFilmPoster('');
              setLocalFilmDescription('');
              setLocalTheaterVisitDate('');
              setLocalRating(0);
              setSelectedFilmForAdd(null);
              setIsManualAddMode(false);
              onNavigate('home');
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 font-inter text-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFilm}
            className="px-6 py-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 font-inter text-lg font-semibold"
            disabled={addingFilm}
          >
            {addingFilm ? <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" /> : null}
            Add Film
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWatchedFilmsPage;
