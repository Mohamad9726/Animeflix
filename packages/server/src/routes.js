import express from 'express';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  catalogSearchSchema,
  addWatchlistSchema,
  updateWatchlistSchema,
  recordWatchSchema,
  ratingSchema,
  subscribeNotificationSchema,
  getRecommendationsSchema,
  getPlaybackQueueSchema,
  validateRequest
} from './validators.js';
import { authenticateToken } from './middleware.js';
import {
  authService,
  catalogService,
  watchlistService,
  watchHistoryService,
  ratingService,
  favoritesService,
  notificationService,
  recommendationService,
  playbackQueueService
} from './services.js';

const router = express.Router();

// ============= Auth Routes =============

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               username: { type: string, minLength: 3 }
 *             required: [email, password, username]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/auth/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { email, password, username } = req.validatedData;
    const result = await authService.authService.register(email, password, username);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *             required: [email, password]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/auth/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedData;
    const result = await authService.authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *             required: [refreshToken]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post('/auth/refresh', validateRequest(refreshTokenSchema), (req, res) => {
  try {
    const { refreshToken } = req.validatedData;
    const result = authService.authService.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// ============= Catalog Routes =============

/**
 * @swagger
 * /api/v1/catalog/search:
 *   get:
 *     summary: Search anime
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema: { type: string }
 *       - in: query
 *         name: genres
 *         schema: { type: array, items: { type: string } }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ongoing, completed, upcoming] }
 *       - in: query
 *         name: page
 *         schema: { type: number, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 20, maximum: 100 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [trending, rating, recent] }
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/catalog/search', validateRequest(catalogSearchSchema), (req, res) => {
  try {
    const { query, genres, status, page, limit, sortBy } = req.validatedData;
    const results = catalogService.search(query, {
      genres: genres ? (typeof genres === 'string' ? [genres] : genres) : undefined,
      status,
      sortBy
    });

    const paginated = results.slice((page - 1) * limit, page * limit);
    res.json({
      data: paginated,
      total: results.length,
      page,
      limit,
      pages: Math.ceil(results.length / limit)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/catalog/anime/{animeId}:
 *   get:
 *     summary: Get anime details with episodes
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Anime details with episodes
 */
router.get('/catalog/anime/:animeId', (req, res) => {
  try {
    const anime = catalogService.getAnimeWithEpisodes(req.params.animeId);
    res.json(anime);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/catalog/genres:
 *   get:
 *     summary: Get all available genres
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: List of genres
 */
router.get('/catalog/genres', (req, res) => {
  try {
    const genres = catalogService.getAllGenres();
    res.json({ genres });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= Watchlist Routes (Protected) =============

/**
 * @swagger
 * /api/v1/watchlist:
 *   get:
 *     summary: Get user watchlist
 *     tags: [Watchlist]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's watchlist
 */
router.get('/watchlist', authenticateToken, (req, res) => {
  try {
    const watchlist = watchlistService.get(req.user.id);
    res.json({ watchlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/watchlist/add:
 *   post:
 *     summary: Add anime to watchlist
 *     tags: [Watchlist]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animeId: { type: string }
 *               status: { type: string, enum: [watching, completed, on-hold, dropped] }
 *             required: [animeId]
 *     responses:
 *       201:
 *         description: Added to watchlist
 */
router.post('/watchlist/add', authenticateToken, validateRequest(addWatchlistSchema), (req, res) => {
  try {
    const { animeId, status } = req.validatedData;
    const result = watchlistService.add(req.user.id, animeId, status);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/watchlist/{animeId}:
 *   delete:
 *     summary: Remove anime from watchlist
 *     tags: [Watchlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed from watchlist
 */
router.delete('/watchlist/:animeId', authenticateToken, (req, res) => {
  try {
    const result = watchlistService.remove(req.user.id, req.params.animeId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/watchlist/{animeId}:
 *   patch:
 *     summary: Update watchlist item status
 *     tags: [Watchlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [watching, completed, on-hold, dropped] }
 *             required: [status]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/watchlist/:animeId', authenticateToken, validateRequest(updateWatchlistSchema), (req, res) => {
  try {
    const { status } = req.validatedData;
    const result = watchlistService.updateStatus(req.user.id, req.params.animeId, status);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= Watch History Routes (Protected) =============

/**
 * @swagger
 * /api/v1/watch-history:
 *   get:
 *     summary: Get user watch history
 *     tags: [Watch History]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's watch history
 */
router.get('/watch-history', authenticateToken, (req, res) => {
  try {
    const history = watchHistoryService.get(req.user.id);
    res.json({ history });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/watch-history/record:
 *   post:
 *     summary: Record watched episode
 *     tags: [Watch History]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animeId: { type: string }
 *               episodeId: { type: string }
 *               position: { type: number }
 *             required: [animeId, episodeId]
 *     responses:
 *       201:
 *         description: Watch recorded
 */
router.post('/watch-history/record', authenticateToken, validateRequest(recordWatchSchema), (req, res) => {
  try {
    const { animeId, episodeId, position } = req.validatedData;
    const result = watchHistoryService.record(
      req.user.id,
      animeId,
      episodeId,
      position
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= Favorites Routes (Protected) =============

/**
 * @swagger
 * /api/v1/favorites:
 *   get:
 *     summary: Get user favorites
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's favorite anime
 */
router.get('/favorites', authenticateToken, (req, res) => {
  try {
    const favorites = favoritesService.get(req.user.id);
    res.json({ favorites });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/favorites/{animeId}:
 *   post:
 *     summary: Add anime to favorites
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Added to favorites
 */
router.post('/favorites/:animeId', authenticateToken, (req, res) => {
  try {
    const result = favoritesService.add(req.user.id, req.params.animeId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/favorites/{animeId}:
 *   delete:
 *     summary: Remove anime from favorites
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed from favorites
 */
router.delete('/favorites/:animeId', authenticateToken, (req, res) => {
  try {
    const result = favoritesService.remove(req.user.id, req.params.animeId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= Ratings Routes (Protected) =============

/**
 * @swagger
 * /api/v1/ratings/{animeId}:
 *   post:
 *     summary: Submit anime rating
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating: { type: number, minimum: 1, maximum: 10 }
 *               review: { type: string }
 *             required: [rating]
 *     responses:
 *       201:
 *         description: Rating submitted
 */
router.post('/ratings/:animeId', authenticateToken, validateRequest(ratingSchema), (req, res) => {
  try {
    const { rating, review } = req.validatedData;
    const result = ratingService.submit(req.user.id, req.params.animeId, rating, review);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/ratings/{animeId}:
 *   get:
 *     summary: Get user's rating for anime
 *     tags: [Ratings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User's rating
 */
router.get('/ratings/:animeId', authenticateToken, (req, res) => {
  try {
    const rating = ratingService.get(req.user.id, req.params.animeId);
    res.json({ rating: rating || null });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= Notifications Routes (Protected) =============

/**
 * @swagger
 * /api/v1/notifications/subscribe:
 *   post:
 *     summary: Subscribe to anime notifications
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animeId: { type: string }
 *               enabled: { type: boolean }
 *             required: [animeId]
 *     responses:
 *       201:
 *         description: Subscribed to notifications
 */
router.post('/notifications/subscribe', authenticateToken, validateRequest(subscribeNotificationSchema), (req, res) => {
  try {
    const { animeId } = req.validatedData;
    const result = notificationService.subscribe(req.user.id, animeId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/notifications/unsubscribe/{animeId}:
 *   post:
 *     summary: Unsubscribe from anime notifications
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Unsubscribed from notifications
 */
router.post('/notifications/unsubscribe/:animeId', authenticateToken, (req, res) => {
  try {
    const result = notificationService.unsubscribe(req.user.id, req.params.animeId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/notifications/subscriptions:
 *   get:
 *     summary: Get user's notification subscriptions
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscribed anime
 */
router.get('/notifications/subscriptions', authenticateToken, (req, res) => {
  try {
    const subscriptions = notificationService.getSubscriptions(req.user.id);
    res.json({ subscriptions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= Recommendations Routes (Protected) =============

/**
 * @swagger
 * /api/v1/recommendations:
 *   get:
 *     summary: Get personalized recommendations
 *     tags: [Recommendations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 10, maximum: 50 }
 *     responses:
 *       200:
 *         description: Personalized recommendations
 */
router.get('/recommendations', authenticateToken, validateRequest(getRecommendationsSchema), (req, res) => {
  try {
    const { limit } = req.validatedData;
    recommendationService.calculate(req.user.id);
    const recommendations = recommendationService.get(req.user.id, limit);
    res.json({ recommendations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ============= Playback Queue Routes (Protected) =============

/**
 * @swagger
 * /api/v1/playback-queue/{animeId}:
 *   get:
 *     summary: Get playback queue for anime
 *     tags: [Playback Queue]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: animeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 5, maximum: 50 }
 *     responses:
 *       200:
 *         description: Playback queue
 */
router.get('/playback-queue/:animeId', authenticateToken, validateRequest(getPlaybackQueueSchema), (req, res) => {
  try {
    const { limit } = req.validatedData;
    const queue = playbackQueueService.get(req.user.id, req.params.animeId, limit);
    res.json({ queue });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
