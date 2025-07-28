import React from 'react';
import StarRating from '../components/StarRating'; // Import StarRating component

const HomePage = ({ onNavigate, recentlyAddedFilms, setSelectedFilm }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4 pt-24">
    <h1 className="text-5xl font-extrabold text-yellow-400 mb-6 font-inter text-center">
      Welcome to CineFlix!
    </h1>
    <p className="text-xl text-gray-300 mb-8 max-w-2xl text-center font-inter leading-relaxed">
      Track the films you've watched at theaters and rate them.
    </p>

    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
      <button
        onClick={() => onNavigate('addFilms')}
        className="px-8 py-4 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-400 transition duration-300 transform hover:scale-105 font-inter text-xl font-semibold"
      >
        Click "Add Watched Films" to log a film
      </button>
      <button
        onClick={() => onNavigate('watchedFilms')}
        className="px-8 py-4 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-400 transition duration-300 transform hover:scale-105 font-inter text-xl font-semibold"
      >
        Click "My Watched Films" to view logged list
      </button>
    </div>

    <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center font-inter">
        Recently Added Films
      </h2>
      {recentlyAddedFilms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentlyAddedFilms.slice(0, 3).map((film) => (
            <div
              key={film.id}
              className="bg-gray-700 p-6 rounded-lg shadow-xl flex flex-col items-center text-center transform hover:scale-105 transition duration-300 cursor-pointer border border-gray-600"
              onClick={() => {
                setSelectedFilm(film); // Set the selected film
                onNavigate('filmDetails');
              }}
            >
              <img
                src={film.poster || `https://placehold.co/100x150/000000/FFFFFF?text=${film.title.substring(0, Math.min(film.title.length, 10))}`}
                alt={film.title}
                className="w-24 h-36 object-cover rounded-md mb-4 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x150/000000/FFFFFF?text=No+Poster`; }}
              />
              <h3 className="text-xl font-semibold text-white mb-2 font-inter">{film.title}</h3>
              <p className="text-gray-300 text-sm mb-2 font-inter">({film.year})</p>
              <StarRating rating={film.rating} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center font-inter">No films added yet. Start logging your watched films!</p>
      )}
    </div>
  </div>
);

export default HomePage;
