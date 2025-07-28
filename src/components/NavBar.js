import React from 'react';
import { ChevronLeft } from 'lucide-react';

const NavBar = ({ onNavigate, showBackButton, onBack }) => (
  <nav className="fixed top-0 left-0 right-0 bg-gray-900 p-4 shadow-lg flex items-center justify-between z-10 rounded-b-lg">
    <div className="flex items-center space-x-4">
      {showBackButton && (
        <button
          onClick={onBack}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      <button
        onClick={() => onNavigate('home')}
        className="text-3xl font-bold font-inter hover:text-blue-400 transition duration-200"
      >
        <span className="text-white">Cine</span>
        <span className="text-yellow-400">Flix</span>
      </button>
    </div>
    <div className="flex space-x-4">
      <button
        onClick={() => onNavigate('addFilms')}
        className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-full shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200 font-inter text-lg"
      >
        Add Watched Films
      </button>
      <button
        onClick={() => onNavigate('watchedFilms')}
        className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-full shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200 font-inter text-lg"
      >
        My Watched Films
      </button>
    </div>
  </nav>
);

export default NavBar;
