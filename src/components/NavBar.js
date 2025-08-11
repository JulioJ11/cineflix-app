import React, { useState } from 'react';
import { ChevronLeft, Activity, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const NavBar = ({ onNavigate, showBackButton, onBack, servicesHealth = {} }) => {
  const [showHealthDetails, setShowHealthDetails] = useState(false);

  // Calculate overall health status
  const getOverallHealthStatus = () => {
    const services = Object.values(servicesHealth);
    if (services.length === 0) return 'unknown';
    
    const healthyServices = services.filter(service => service.status === 'healthy').length;
    const totalServices = services.length;
    
    if (healthyServices === totalServices) return 'healthy';
    if (healthyServices > 0) return 'partial';
    return 'unhealthy';
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400';
      case 'partial':
        return 'text-yellow-400';
      case 'unhealthy':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const overallHealth = getOverallHealthStatus();

  return (
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
        
        {/* Microservices Health Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowHealthDetails(!showHealthDetails)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition duration-200 ${getHealthColor(overallHealth)}`}
            title="Microservices Status"
          >
            {getHealthIcon(overallHealth)}
            <span className="text-xs font-medium hidden sm:inline">
              {overallHealth === 'healthy' ? 'All Systems' : 
               overallHealth === 'partial' ? 'Some Issues' : 
               overallHealth === 'unhealthy' ? 'Systems Down' : 'Checking...'}
            </span>
          </button>

          {/* Health Details Dropdown */}
          {showHealthDetails && (
            <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 min-w-64 z-50">
              <h4 className="text-white font-semibold mb-3 text-sm">Microservices Status</h4>
              <div className="space-y-2">
                {Object.entries({
                  'Recommendations': servicesHealth.recommendation,
                  'Watchlist': servicesHealth.watchlist,
                  'Sorting & Filtering': servicesHealth.sorting,
                  'Wildcard Suggestions': servicesHealth.wildcard
                }).map(([serviceName, health]) => (
                  <div key={serviceName} className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs">{serviceName}</span>
                    <div className="flex items-center space-x-2">
                      {health ? (
                        <>
                          {health.status === 'healthy' ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-400" />
                          )}
                          <span className={`text-xs ${health.status === 'healthy' ? 'text-green-400' : 'text-red-400'}`}>
                            {health.status === 'healthy' ? 'Online' : 'Offline'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-3 h-3 text-gray-400 animate-pulse" />
                          <span className="text-xs text-gray-400">Checking...</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {overallHealth !== 'healthy' && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-yellow-400 text-xs">
                    Some features may be limited due to service issues.
                  </p>
                </div>
              )}
              
              {servicesHealth.recommendation && servicesHealth.recommendation.timestamp && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-gray-500 text-xs">
                    Last checked: {new Date(servicesHealth.recommendation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
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

      {/* Click outside to close health details */}
      {showHealthDetails && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowHealthDetails(false)}
        />
      )}
    </nav>
  );
};

export default NavBar;