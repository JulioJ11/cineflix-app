import React, { useState } from 'react';
import { TrendingUp, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import StarRating from '../components/StarRating';

const HomePage = ({ 
  onNavigate, 
  recentlyAddedFilms, 
  setSelectedFilm, 
  recommendations = [], 
  trendingFilms = [], 
  watchlist = [],
  servicesHealth = {},
  addToWatchlist,
  showAlert,
  userId,
  wildcardSuggestion = null,
  loadWildcardSuggestion
}) => {
  const [activeTab, setActiveTab] = useState('recent');

  // Service health indicator component
  const ServiceHealthIndicator = ({ serviceName, health }) => {
    const isHealthy = health && health.status === 'healthy';
    return (
      <div className="flex items-center space-x-1">
        {isHealthy ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-400" />
        )}
        <span className={`text-xs ${isHealthy ? 'text-green-400' : 'text-red-400'}`}>
          {serviceName}
        </span>
      </div>
    );
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'recent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyAddedFilms.length > 0 ? (
              recentlyAddedFilms.slice(0, 6).map((film) => (
                <div
                  key={film.id}
                  className="bg-gray-700 p-6 rounded-lg shadow-xl flex flex-col items-center text-center transform hover:scale-105 transition duration-300 cursor-pointer border border-gray-600"
                  onClick={() => {
                    setSelectedFilm(film);
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
                  <p className="text-gray-400 text-xs mt-2">Added: {film.watchedDate}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center">
                <p className="text-gray-400 font-inter">No films added yet. Start logging your watched films!</p>
              </div>
            )}
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-300 text-sm">
                    Based on your ratings and preferences
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((film) => (
                    <div
                      key={film.id}
                      className="bg-gray-700 p-4 rounded-lg shadow-xl border border-gray-600 hover:border-yellow-400 transition duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-24 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-300">
                          Poster
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-1">{film.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">{film.genre} • {film.year}</p>
                          <p className="text-gray-400 text-xs mb-2">Director: {film.director}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 text-sm">{film.rating}</span>
                          </div>
                          <button
                            onClick={() => addToWatchlist({
                              id: film.id,
                              title: film.title,
                              genre: film.genre,
                              releaseYear: film.year
                            })}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition duration-200"
                          >
                            Add to Watchlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-inter text-lg mb-2">No recommendations yet</p>
                <p className="text-gray-500 text-sm">Rate at least 5 films to get personalized recommendations</p>
              </div>
            )}
          </div>
        );

      case 'trending':
        return (
          <div className="space-y-4">
            {trendingFilms.length > 0 ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-300 text-sm">
                    Popular films trending now
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingFilms.slice(0, 6).map((film) => (
                    <div
                      key={film.id}
                      className="bg-gray-700 p-4 rounded-lg shadow-xl border border-gray-600 hover:border-green-400 transition duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-24 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-300">
                          Poster
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-1">{film.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">{film.genre} • {film.year}</p>
                          <p className="text-gray-400 text-xs mb-2">Director: {film.director}</p>
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-yellow-400 text-sm">{film.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-sm">{film.popularity}%</span>
                            </div>
                          </div>
                          <button
                            onClick={() => addToWatchlist({
                              id: film.id,
                              title: film.title,
                              genre: film.genre,
                              releaseYear: film.year
                            })}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition duration-200"
                          >
                            Add to Watchlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-inter text-lg mb-2">No trending films available</p>
                <p className="text-gray-500 text-sm">Check back later for trending content</p>
              </div>
            )}
          </div>
        );

      case 'watchlist':
        return (
          <div className="space-y-4">
            {watchlist.length > 0 ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-300 text-sm">
                    Films you want to watch
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {watchlist.slice(0, 6).map((film) => (
                    <div
                      key={film.id}
                      className="bg-gray-700 p-4 rounded-lg shadow-xl border border-gray-600 hover:border-purple-400 transition duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-24 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-300 overflow-hidden">
                          {film.poster ? (
                            <img
                              src={film.poster}
                              alt={film.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { 
                                e.target.onerror = null; 
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = 'Poster';
                              }}
                            />
                          ) : (
                            'Poster'
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-1">{film.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">{film.genre} • {film.releaseYear}</p>
                          <div className="flex items-center space-x-1 mb-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-xs">
                              {film.status === 'want_to_watch' ? 'Want to watch' : 
                               film.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs">Added: {new Date(film.addedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {watchlist.length > 6 && (
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">And {watchlist.length - 6} more films in your watchlist</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-inter text-lg mb-2">Your watchlist is empty</p>
                <p className="text-gray-500 text-sm">Add films from recommendations or trending section</p>
              </div>
            )}
          </div>
        );

      case 'wildcard':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-300 text-sm mb-4">
                Feeling adventurous? Get a completely random movie suggestion!
              </p>
              <button
                onClick={() => loadWildcardSuggestion && loadWildcardSuggestion()}
                className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 font-inter text-lg font-semibold"
              >
                🎲 Get New Wildcard
              </button>
            </div>
            
            {wildcardSuggestion ? (
              <div className="flex justify-center">
                <div className="bg-gray-700 p-6 rounded-lg shadow-xl border border-purple-400 max-w-md w-full">
                  <div className="flex flex-col items-center text-center">
                    {wildcardSuggestion.poster ? (
                      <img
                        src={wildcardSuggestion.poster}
                        alt={wildcardSuggestion.title}
                        className="w-32 h-48 object-cover rounded-md mb-4 shadow-lg"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="w-32 h-48 bg-gray-600 rounded-md mb-4 flex items-center justify-center text-gray-300 text-sm">No Poster</div>';
                        }}
                      />
                    ) : (
                      <div className="w-32 h-48 bg-gray-600 rounded-md mb-4 flex items-center justify-center text-gray-300 text-sm">
                        No Poster
                      </div>
                    )}
                    
                    <h4 className="text-xl font-bold text-white mb-2">{wildcardSuggestion.title}</h4>
                    <p className="text-purple-400 text-sm mb-2">{wildcardSuggestion.genre} • {wildcardSuggestion.releaseYear}</p>
                    
                    {wildcardSuggestion.rating && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-sm">{wildcardSuggestion.rating}/10</span>
                      </div>
                    )}
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {wildcardSuggestion.description}
                    </p>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => addToWatchlist({
                          id: wildcardSuggestion._id,
                          title: wildcardSuggestion.title,
                          genre: wildcardSuggestion.genre,
                          releaseYear: wildcardSuggestion.releaseYear,
                          description: wildcardSuggestion.description,
                          poster: wildcardSuggestion.poster
                        })}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition duration-200"
                      >
                        Add to Watchlist
                      </button>
                      
                      <button
                        onClick={() => loadWildcardSuggestion && loadWildcardSuggestion()}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition duration-200"
                      >
                        🎲 Another One
                      </button>
                    </div>
                    
                    {wildcardSuggestion.metadata && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <p className="text-gray-500 text-xs">
                          Source: {wildcardSuggestion.metadata.source}
                        </p>
                        {wildcardSuggestion.metadata.processingTime && (
                          <p className="text-gray-500 text-xs">
                            Response: {wildcardSuggestion.metadata.processingTime}ms
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎲</div>
                <p className="text-gray-400 font-inter text-lg mb-2">Ready for a surprise?</p>
                <p className="text-gray-500 text-sm">Click "Get New Wildcard" to discover a random movie!</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4 pt-24">
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-4 font-inter text-center">
        Welcome to CineFlix!
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl text-center font-inter leading-relaxed">
        Track the films you've watched at theaters and discover new ones.
      </p>

      {/* Service Health Dashboard */}
      <div className="w-full max-w-6xl mb-8">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Microservices Status</h3>
          <div className="flex flex-wrap gap-4">
            <ServiceHealthIndicator serviceName="Recommendations" health={servicesHealth.recommendation} />
            <ServiceHealthIndicator serviceName="Watchlist" health={servicesHealth.watchlist} />
            <ServiceHealthIndicator serviceName="Sorting" health={servicesHealth.sorting} />
            <ServiceHealthIndicator serviceName="Wildcard" health={servicesHealth.wildcard} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
        <button
          onClick={() => onNavigate('addFilms')}
          className="px-8 py-4 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-400 transition duration-300 transform hover:scale-105 font-inter text-xl font-semibold"
        >
          Add Watched Films
        </button>
        <button
          onClick={() => onNavigate('watchedFilms')}
          className="px-8 py-4 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-400 transition duration-300 transform hover:scale-105 font-inter text-xl font-semibold"
        >
          My Watched Films
        </button>
      </div>

      {/* Enhanced Content Section with Tabs */}
      <div className="w-full max-w-6xl bg-gray-900 rounded-xl shadow-2xl border border-gray-700">
        {/* Tab Navigation */}
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-8 pt-6">
            {[
              { id: 'recent', label: 'Recently Added', icon: Clock },
              { id: 'recommendations', label: 'For You', icon: Star },
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'watchlist', label: 'Watchlist', icon: Clock },
              { id: 'wildcard', label: 'Wildcard', icon: () => <span className="text-sm">🎲</span> }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                  activeTab === id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Statistics Card */}
      <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center">
          <h4 className="text-2xl font-bold text-yellow-400">{recentlyAddedFilms.length}</h4>
          <p className="text-gray-400 text-sm">Films Watched</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center">
          <h4 className="text-2xl font-bold text-blue-400">{recommendations.length}</h4>
          <p className="text-gray-400 text-sm">Recommendations</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center">
          <h4 className="text-2xl font-bold text-green-400">{trendingFilms.length}</h4>
          <p className="text-gray-400 text-sm">Trending Films</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center">
          <h4 className="text-2xl font-bold text-purple-400">{watchlist.length}</h4>
          <p className="text-gray-400 text-sm">Watchlist Items</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;