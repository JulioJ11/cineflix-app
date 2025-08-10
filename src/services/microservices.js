// src/services/microservices.js
// API integration layer for CineFlix microservices

const SERVICES = {
  RECOMMENDATION: 'http://localhost:3001',
  WATCHLIST: 'http://localhost:3002',
  SORTING: 'http://localhost:3003'
};

// Helper function for API calls with error handling
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Film Recommendation Service API (Service B)
export const recommendationService = {
  // Create/update user profile
  createUserProfile: async (userId, watchHistory = [], ratings = []) => {
    return apiCall(`${SERVICES.RECOMMENDATION}/api/users/${userId}/profile`, {
      method: 'POST',
      body: JSON.stringify({ watchHistory, ratings })
    });
  },

  // Add film rating
  addRating: async (userId, filmId, score) => {
    return apiCall(`${SERVICES.RECOMMENDATION}/api/users/${userId}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ filmId, score })
    });
  },

  // Get personalized recommendations
  getRecommendations: async (userId, count = 5) => {
    return apiCall(`${SERVICES.RECOMMENDATION}/api/recommendations/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ count })
    });
  },

  // Get trending films
  getTrending: async () => {
    return apiCall(`${SERVICES.RECOMMENDATION}/api/trending`);
  },

  // Get personalized trending films
  getPersonalizedTrending: async (userId) => {
    return apiCall(`${SERVICES.RECOMMENDATION}/api/trending/personalized/${userId}`, {
      method: 'POST'
    });
  },

  // Get all films from recommendation service
  getAllFilms: async () => {
    return apiCall(`${SERVICES.RECOMMENDATION}/api/films`);
  },

  // Health check
  healthCheck: async () => {
    return apiCall(`${SERVICES.RECOMMENDATION}/health`);
  }
};

// Film Watchlist Management Service API (Service C)
export const watchlistService = {
  // Add film to watchlist
  addToWatchlist: async (userId, filmData) => {
    return apiCall(`${SERVICES.WATCHLIST}/api/watchlist/${userId}/films`, {
      method: 'POST',
      body: JSON.stringify(filmData)
    });
  },

  // Get user's watchlist
  getWatchlist: async (userId, status = null) => {
    const queryParam = status ? `?status=${status}` : '';
    return apiCall(`${SERVICES.WATCHLIST}/api/watchlist/${userId}${queryParam}`);
  },

  // Remove film from watchlist
  removeFromWatchlist: async (userId, filmId) => {
    return apiCall(`${SERVICES.WATCHLIST}/api/watchlist/${userId}/films/${filmId}`, {
      method: 'DELETE'
    });
  },

  // Update film status in watchlist
  updateFilmStatus: async (userId, filmId, status) => {
    return apiCall(`${SERVICES.WATCHLIST}/api/watchlist/${userId}/films/${filmId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Set notification preferences
  setNotificationPreferences: async (userId, timing = 'day_of_release', enabled = true) => {
    return apiCall(`${SERVICES.WATCHLIST}/api/watchlist/${userId}/notifications/preferences`, {
      method: 'POST',
      body: JSON.stringify({ timing, enabled })
    });
  },

  // Get user notifications
  getNotifications: async (userId) => {
    return apiCall(`${SERVICES.WATCHLIST}/api/notifications/${userId}`);
  },

  // Check for new releases
  checkReleases: async () => {
    return apiCall(`${SERVICES.WATCHLIST}/api/notifications/check-releases`, {
      method: 'POST'
    });
  },

  // Process notifications
  processNotifications: async () => {
    return apiCall(`${SERVICES.WATCHLIST}/api/notifications/process`, {
      method: 'POST'
    });
  },

  // Get upcoming releases
  getUpcomingReleases: async () => {
    return apiCall(`${SERVICES.WATCHLIST}/api/releases/upcoming`);
  },

  // Health check
  healthCheck: async () => {
    return apiCall(`${SERVICES.WATCHLIST}/health`);
  }
};

// Film Sorting and Filtering Service API (Service D)
export const sortingService = {
  // Sort films
  sortFilms: async (userId, criteria, order = 'desc', filmType = 'watched') => {
    return apiCall(`${SERVICES.SORTING}/api/films/${userId}/sort`, {
      method: 'POST',
      body: JSON.stringify({ criteria, order, filmType })
    });
  },

  // Filter films
  filterFilms: async (userId, filters, filmType = 'watched') => {
    return apiCall(`${SERVICES.SORTING}/api/films/${userId}/filter`, {
      method: 'POST',
      body: JSON.stringify({ filters, filmType })
    });
  },

  // Sort and filter films in one call
  sortAndFilterFilms: async (userId, sortCriteria, sortOrder = 'desc', filters = {}, filmType = 'watched') => {
    return apiCall(`${SERVICES.SORTING}/api/films/${userId}/sort-and-filter`, {
      method: 'POST',
      body: JSON.stringify({ 
        sortCriteria, 
        sortOrder, 
        filters, 
        filmType 
      })
    });
  },

  // Get user's film collection
  getFilmCollection: async (userId, type = 'all') => {
    const queryParam = type !== 'all' ? `?type=${type}` : '';
    return apiCall(`${SERVICES.SORTING}/api/films/${userId}${queryParam}`);
  },

  // Update user's film collection
  updateFilmCollection: async (userId, watchedFilms = [], watchlistFilms = []) => {
    return apiCall(`${SERVICES.SORTING}/api/films/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ watchedFilms, watchlistFilms })
    });
  },

  // Get available filter options
  getFilterOptions: async (userId, filmType = 'watched') => {
    return apiCall(`${SERVICES.SORTING}/api/filters/options/${userId}?filmType=${filmType}`);
  },

  // Health check
  healthCheck: async () => {
    return apiCall(`${SERVICES.SORTING}/health`);
  }
};

// Utility functions for data transformation
export const dataTransformers = {
  // Convert CineFlix film format to microservice format
  filmToMicroservice: (film) => ({
    id: film.id,
    title: film.title,
    genre: film.genre || 'Unknown',
    rating: film.rating || 0,
    dateWatched: film.watchedDate,
    releaseYear: film.year || new Date().getFullYear(),
    poster: film.poster,
    description: film.description || '',
    thoughts: film.thoughts || ''
  }),

  // Convert microservice film format to CineFlix format
  filmFromMicroservice: (film) => ({
    id: film.id,
    title: film.title,
    year: film.releaseYear || film.year,
    rating: film.rating || 0,
    watchedDate: film.dateWatched,
    poster: film.poster,
    description: film.description || '',
    thoughts: film.thoughts || ''
  }),

  // Convert CineFlix films array to microservice format
  filmsToMicroservice: (films) => films.map(dataTransformers.filmToMicroservice),

  // Convert microservice films array to CineFlix format
  filmsFromMicroservice: (films) => films.map(dataTransformers.filmFromMicroservice)
};

// Service health monitoring
export const healthMonitor = {
  checkAllServices: async () => {
    const results = {};
    
    try {
      results.recommendation = await recommendationService.healthCheck();
    } catch (error) {
      results.recommendation = { status: 'unhealthy', error: error.message };
    }
    
    try {
      results.watchlist = await watchlistService.healthCheck();
    } catch (error) {
      results.watchlist = { status: 'unhealthy', error: error.message };
    }
    
    try {
      results.sorting = await sortingService.healthCheck();
    } catch (error) {
      results.sorting = { status: 'unhealthy', error: error.message };
    }
    
    return results;
  },

  isServiceHealthy: (healthResult) => {
    return healthResult && healthResult.status === 'healthy';
  }
};

// Error handling utilities
export const errorHandler = {
  handleServiceError: (error, serviceName, fallbackAction = null) => {
    console.error(`${serviceName} service error:`, error);
    
    // You can add more sophisticated error handling here
    // For example, retry logic, circuit breaker pattern, etc.
    
    if (fallbackAction && typeof fallbackAction === 'function') {
      return fallbackAction();
    }
    
    throw new Error(`${serviceName} service is currently unavailable. Please try again later.`);
  },

  retryOperation: async (operation, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        console.warn(`Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
};

// Configuration
export const config = {
  services: SERVICES,
  defaultUserId: 'user1', // You can make this dynamic based on authentication
  retryOptions: {
    maxRetries: 3,
    initialDelay: 1000
  }
};