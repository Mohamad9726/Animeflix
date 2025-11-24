import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// In-memory storage
export const storage = {
  users: new Map(),
  anime: new Map(),
  episodes: new Map(),
  watchlist: new Map(), // userId -> Map of animeId -> { status, addedAt, episodes: [] }
  watchHistory: new Map(), // userId -> Array of { animeId, episodeId, watchedAt, position }
  ratings: new Map(), // userId -> Map of animeId -> { rating, review, ratedAt }
  favorites: new Map(), // userId -> Set of animeIds
  notifications: new Map(), // userId -> Array of notifications
  notificationSubscriptions: new Map(), // userId -> Set of animeIds
  recommendations: new Map(), // userId -> Array of recommendations
  comments: new Map(), // animeId:episodeId -> Array of comments
  trends: new Map(), // animeId -> trend data
  activeUsers: new Map(), // animeId:episodeId -> Set of user IDs
  refreshTokens: new Set() // For token blacklist/validation
};

// Initialize with sample data
export const initializeSampleData = () => {
  // Sample anime data
  const sampleAnime = [
    {
      id: 'anime-1',
      title: 'Attack on Titan',
      description: 'Humanity fights for survival against giant humanoid creatures called Titans',
      genres: ['Action', 'Drama', 'Fantasy'],
      tags: ['Dark', 'Intense', 'Gore'],
      rating: 9.0,
      status: 'completed',
      totalEpisodes: 139,
      coverImage: 'https://via.placeholder.com/300x400?text=AOT',
      releaseDate: '2013-04-07',
      studio: 'Wit Studio'
    },
    {
      id: 'anime-2',
      title: 'Death Note',
      description: 'A high school student discovers a supernatural notebook that allows him to kill anyone',
      genres: ['Mystery', 'Supernatural', 'Thriller'],
      tags: ['Psychological', 'Mind Games', 'Dark'],
      rating: 8.8,
      status: 'completed',
      totalEpisodes: 37,
      coverImage: 'https://via.placeholder.com/300x400?text=DeathNote',
      releaseDate: '2006-10-03',
      studio: 'Madhouse'
    },
    {
      id: 'anime-3',
      title: 'Demon Slayer',
      description: 'A young man trains to become a demon slayer to save his sister',
      genres: ['Action', 'Adventure', 'Supernatural'],
      tags: ['Beautiful Animation', 'Intense Battles', 'Emotional'],
      rating: 8.7,
      status: 'ongoing',
      totalEpisodes: 50,
      coverImage: 'https://via.placeholder.com/300x400?text=DemonSlayer',
      releaseDate: '2019-04-06',
      studio: 'Ufotable'
    },
    {
      id: 'anime-4',
      title: 'Steins;Gate',
      description: 'A group of friends discovers a way to send messages to the past',
      genres: ['Sci-Fi', 'Thriller', 'Drama'],
      tags: ['Time Travel', 'Complex Plot', 'Mystery'],
      rating: 9.1,
      status: 'completed',
      totalEpisodes: 24,
      coverImage: 'https://via.placeholder.com/300x400?text=SteinsGate',
      releaseDate: '2011-04-09',
      studio: 'White Fox'
    },
    {
      id: 'anime-5',
      title: 'Neon Genesis Evangelion',
      description: 'Teenagers pilot giant robots to fight invading aliens',
      genres: ['Mecha', 'Sci-Fi', 'Drama'],
      tags: ['Psychological', 'Deep', 'Philosophical'],
      rating: 7.9,
      status: 'completed',
      totalEpisodes: 26,
      coverImage: 'https://via.placeholder.com/300x400?text=NGE',
      releaseDate: '1995-10-04',
      studio: 'Gainax'
    }
  ];

  sampleAnime.forEach(anime => {
    storage.anime.set(anime.id, {
      ...anime,
      viewCount: Math.floor(Math.random() * 10000),
      favorites: Math.floor(Math.random() * 5000),
      totalRatings: Math.floor(Math.random() * 1000)
    });
  });

  // Sample episodes
  const episodesByAnime = {
    'anime-1': 139,
    'anime-2': 37,
    'anime-3': 50,
    'anime-4': 24,
    'anime-5': 26
  };

  for (const [animeId, episodeCount] of Object.entries(episodesByAnime)) {
    for (let i = 1; i <= episodeCount; i++) {
      const episodeId = `${animeId}-ep-${i}`;
      storage.episodes.set(episodeId, {
        id: episodeId,
        animeId,
        episodeNumber: i,
        title: `Episode ${i}`,
        description: `Season episode ${i}`,
        duration: 24,
        airDate: new Date(2013, 3, 6 + i * 7).toISOString().split('T')[0],
        rating: 7.5 + Math.random() * 2
      });
    }
  }
};

// User operations
export const createUser = async (email, password, username) => {
  if (storage.users.has(email)) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  const user = {
    id: userId,
    email,
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  storage.users.set(email, user);
  storage.watchlist.set(userId, new Map());
  storage.watchHistory.set(userId, []);
  storage.ratings.set(userId, new Map());
  storage.favorites.set(userId, new Set());
  storage.notificationSubscriptions.set(userId, new Set());

  return user;
};

export const getUserByEmail = (email) => {
  return storage.users.get(email);
};

export const getUserById = (userId) => {
  for (const user of storage.users.values()) {
    if (user.id === userId) {
      return user;
    }
  }
  return null;
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Anime operations
export const getAnime = (animeId) => {
  return storage.anime.get(animeId);
};

export const getAllAnime = () => {
  return Array.from(storage.anime.values());
};

export const searchAnime = (query, filters = {}) => {
  let results = Array.from(storage.anime.values());

  if (query) {
    results = results.filter(a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (filters.genres && filters.genres.length > 0) {
    results = results.filter(a =>
      filters.genres.some(g => a.genres.includes(g))
    );
  }

  if (filters.status) {
    results = results.filter(a => a.status === filters.status);
  }

  // Sort by trending (view count), rating, or recent
  if (filters.sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'recent') {
    results.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  } else {
    results.sort((a, b) => b.viewCount - a.viewCount);
  }

  return results;
};

// Episodes operations
export const getEpisode = (episodeId) => {
  return storage.episodes.get(episodeId);
};

export const getAnimeEpisodes = (animeId) => {
  const episodes = [];
  for (const episode of storage.episodes.values()) {
    if (episode.animeId === animeId) {
      episodes.push(episode);
    }
  }
  return episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
};

// Watchlist operations
export const addToWatchlist = (userId, animeId, status = 'watching') => {
  if (!storage.watchlist.has(userId)) {
    storage.watchlist.set(userId, new Map());
  }

  const userWatchlist = storage.watchlist.get(userId);
  userWatchlist.set(animeId, {
    status,
    addedAt: new Date().toISOString(),
    episodes: []
  });
};

export const getWatchlist = (userId) => {
  const userWatchlist = storage.watchlist.get(userId) || new Map();
  return Array.from(userWatchlist.entries()).map(([animeId, data]) => ({
    animeId,
    anime: storage.anime.get(animeId),
    ...data
  }));
};

export const updateWatchlistStatus = (userId, animeId, status) => {
  const userWatchlist = storage.watchlist.get(userId);
  if (userWatchlist && userWatchlist.has(animeId)) {
    const entry = userWatchlist.get(animeId);
    entry.status = status;
    entry.updatedAt = new Date().toISOString();
  }
};

export const removeFromWatchlist = (userId, animeId) => {
  const userWatchlist = storage.watchlist.get(userId);
  if (userWatchlist) {
    userWatchlist.delete(animeId);
  }
};

// Watch history operations
export const recordWatch = (userId, animeId, episodeId, position = 0) => {
  if (!storage.watchHistory.has(userId)) {
    storage.watchHistory.set(userId, []);
  }

  const history = storage.watchHistory.get(userId);
  const existingEntry = history.find(h => h.episodeId === episodeId);

  if (existingEntry) {
    existingEntry.watchedAt = new Date().toISOString();
    existingEntry.position = position;
  } else {
    history.push({
      animeId,
      episodeId,
      watchedAt: new Date().toISOString(),
      position
    });
  }
};

export const getWatchHistory = (userId) => {
  return storage.watchHistory.get(userId) || [];
};

// Rating operations
export const submitRating = (userId, animeId, rating, review = '') => {
  if (!storage.ratings.has(userId)) {
    storage.ratings.set(userId, new Map());
  }

  const userRatings = storage.ratings.get(userId);
  userRatings.set(animeId, {
    rating,
    review,
    ratedAt: new Date().toISOString()
  });
};

export const getRating = (userId, animeId) => {
  const userRatings = storage.ratings.get(userId);
  if (userRatings) {
    return userRatings.get(animeId);
  }
  return null;
};

// Favorites operations
export const addToFavorites = (userId, animeId) => {
  if (!storage.favorites.has(userId)) {
    storage.favorites.set(userId, new Set());
  }
  storage.favorites.get(userId).add(animeId);
};

export const removeFromFavorites = (userId, animeId) => {
  if (storage.favorites.has(userId)) {
    storage.favorites.get(userId).delete(animeId);
  }
};

export const getFavorites = (userId) => {
  const favorites = storage.favorites.get(userId) || new Set();
  return Array.from(favorites).map(animeId => storage.anime.get(animeId));
};

export const isFavorite = (userId, animeId) => {
  const favorites = storage.favorites.get(userId) || new Set();
  return favorites.has(animeId);
};

// Notification subscriptions
export const subscribeToNotifications = (userId, animeId) => {
  if (!storage.notificationSubscriptions.has(userId)) {
    storage.notificationSubscriptions.set(userId, new Set());
  }
  storage.notificationSubscriptions.get(userId).add(animeId);
};

export const unsubscribeFromNotifications = (userId, animeId) => {
  if (storage.notificationSubscriptions.has(userId)) {
    storage.notificationSubscriptions.get(userId).delete(animeId);
  }
};

export const getSubscriptions = (userId) => {
  const subs = storage.notificationSubscriptions.get(userId) || new Set();
  return Array.from(subs).map(animeId => storage.anime.get(animeId));
};

// Recommendations
export const calculateRecommendations = (userId) => {
  const userWatchlist = storage.watchlist.get(userId);
  const userRatings = storage.ratings.get(userId);
  const watchedAnimes = new Set();

  if (userWatchlist) {
    watchedAnimes.add(...userWatchlist.keys());
  }

  const recommendations = [];
  const genreScores = new Map();

  // Collect genres from watched anime
  for (const animeId of watchedAnimes) {
    const anime = storage.anime.get(animeId);
    if (anime) {
      anime.genres.forEach(genre => {
        genreScores.set(genre, (genreScores.get(genre) || 0) + 1);
      });
    }
  }

  // Find similar anime
  for (const anime of storage.anime.values()) {
    if (watchedAnimes.has(anime.id)) continue;

    let similarity = 0;
    anime.genres.forEach(genre => {
      if (genreScores.has(genre)) {
        similarity += genreScores.get(genre);
      }
    });

    if (similarity > 0) {
      recommendations.push({
        animeId: anime.id,
        anime,
        similarity,
        reason: `Similar to your watched anime`
      });
    }
  }

  // Sort by similarity and rating
  recommendations.sort((a, b) => {
    const similarityDiff = b.similarity - a.similarity;
    if (similarityDiff !== 0) return similarityDiff;
    return b.anime.rating - a.anime.rating;
  });

  storage.recommendations.set(userId, recommendations);
  return recommendations;
};

export const getRecommendations = (userId, limit = 10) => {
  const recs = storage.recommendations.get(userId) || [];
  return recs.slice(0, limit);
};

// Playback queue
export const getPlaybackQueue = (userId, animeId, limit = 5) => {
  const watchlist = storage.watchlist.get(userId);
  if (!watchlist || !watchlist.has(animeId)) {
    return [];
  }

  const episodes = getAnimeEpisodes(animeId);
  const history = getWatchHistory(userId);
  const watchedEpisodeIds = new Set(history.map(h => h.episodeId));

  const queue = episodes
    .filter(ep => !watchedEpisodeIds.has(ep.id))
    .slice(0, limit)
    .map(ep => ({
      ...ep,
      status: 'queued'
    }));

  return queue;
};
