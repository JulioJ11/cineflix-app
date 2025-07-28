import React from 'react';
import StarRating from '../components/StarRating'; // Import StarRating component

const MyWatchedFilmsPage = ({ onNavigate, films, setSelectedFilm }) => (
  <div className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-4 pt-24">
    <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 font-inter text-center">
      My Watched Films
    </h1>
    <p className="text-lg text-gray-300 mb-8 max-w-xl text-center font-inter">
      Your list of watched films at the theaters. Click on a film to select it.
    </p>

    {films.length > 0 ? (
      <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700 overflow-y-auto max-h-[60vh]">
        {films.map((film) => (
          <div
            key={film.id}
            className="bg-gray-700 p-6 rounded-lg shadow-xl flex items-center mb-6 last:mb-0 transform hover:scale-[1.02] transition duration-300 cursor-pointer border border-gray-600"
            onClick={() => {
              setSelectedFilm(film); // Set the selected film
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
              <p className="text-gray-300 text-sm font-inter">Watched Date: {film.watchedDate}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400 text-center font-inter text-xl">You haven't logged any films yet. Add one!</p>
    )}
  </div>
);

export default MyWatchedFilmsPage;
