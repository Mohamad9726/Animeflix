import * as models from './models.js';
import { generateToken, verifyRefreshToken } from './middleware.js';

// Auth Service
export const authService = {
  async register(email, password, username) {
    const user = await models.createUser(email, password, username);
    const { token, refreshToken } = generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token,
      refreshToken
    };
  },

  async login(email, password) {
    const user = models.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await models.verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    const { token, refreshToken } = generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token,
      refreshToken
    };
  },

  refreshToken(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    const user = models.getUserById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    const { token: newToken, refreshToken: newRefreshToken } = generateToken(user);
    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  }
};

// Catalog Service
export const catalogService = {
  search(query, filters) {
    return models.searchAnime(query, filters);
  },

  getAnime(animeId) {
    return models.getAnime(animeId);
  },

  getAnimeWithEpisodes(animeId) {
    const anime = models.getAnime(animeId);
    if (!anime) {
      throw new Error('Anime not found');
    }

    const episodes = models.getAnimeEpisodes(animeId);
    return {
      ...anime,
      episodes
    };
  },

  getAllGenres() {
    const genreSet = new Set();
    for (const anime of models.getAllAnime()) {
      anime.genres.forEach(g => genreSet.add(g));
    }
    return Array.from(genreSet).sort();
  }
};

// Watchlist Service
export const watchlistService = {
  add(userId, animeId, status = 'watching') {
    models.addToWatchlist(userId, animeId, status);
    return { success: true };
  },

  get(userId) {
    return models.getWatchlist(userId);
  },

  updateStatus(userId, animeId, status) {
    models.updateWatchlistStatus(userId, animeId, status);
    return { success: true };
  },

  remove(userId, animeId) {
    models.removeFromWatchlist(userId, animeId);
    return { success: true };
  }
};

// Watch History Service
export const watchHistoryService = {
  record(userId, animeId, episodeId, position = 0) {
    models.recordWatch(userId, animeId, episodeId, position);
    return { success: true };
  },

  get(userId) {
    return models.getWatchHistory(userId);
  }
};

// Rating Service
export const ratingService = {
  submit(userId, animeId, rating, review = '') {
    if (rating < 1 || rating > 10) {
      throw new Error('Rating must be between 1 and 10');
    }
    models.submitRating(userId, animeId, rating, review);
    return { success: true };
  },

  get(userId, animeId) {
    return models.getRating(userId, animeId);
  }
};

// Favorites Service
export const favoritesService = {
  add(userId, animeId) {
    models.addToFavorites(userId, animeId);
    return { success: true };
  },

  remove(userId, animeId) {
    models.removeFromFavorites(userId, animeId);
    return { success: true };
  },

  get(userId) {
    return models.getFavorites(userId);
  },

  isFavorite(userId, animeId) {
    return models.isFavorite(userId, animeId);
  }
};

// Notification Service
export const notificationService = {
  subscribe(userId, animeId) {
    models.subscribeToNotifications(userId, animeId);
    return { success: true };
  },

  unsubscribe(userId, animeId) {
    models.unsubscribeFromNotifications(userId, animeId);
    return { success: true };
  },

  getSubscriptions(userId) {
    return models.getSubscriptions(userId);
  }
};

// Recommendation Service
export const recommendationService = {
  calculate(userId) {
    return models.calculateRecommendations(userId);
  },

  get(userId, limit = 10) {
    return models.getRecommendations(userId, limit);
  }
};

// Playback Queue Service
export const playbackQueueService = {
  get(userId, animeId, limit = 5) {
    return models.getPlaybackQueue(userId, animeId, limit);
  }
};
