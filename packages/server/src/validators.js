import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50)
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// Catalog validators
export const catalogSearchSchema = z.object({
  query: z.string().optional(),
  genres: z.array(z.string()).optional(),
  status: z.enum(['ongoing', 'completed', 'upcoming']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['trending', 'rating', 'recent']).optional().default('trending')
});

// Watchlist validators
export const addWatchlistSchema = z.object({
  animeId: z.string(),
  status: z.enum(['watching', 'completed', 'on-hold', 'dropped']).default('watching')
});

export const updateWatchlistSchema = z.object({
  status: z.enum(['watching', 'completed', 'on-hold', 'dropped'])
});

// Watch history validators
export const recordWatchSchema = z.object({
  animeId: z.string(),
  episodeId: z.string(),
  watchedAt: z.number().optional(),
  duration: z.number().optional(),
  position: z.number().optional()
});

// Rating validators
export const ratingSchema = z.object({
  rating: z.number().min(1).max(10),
  review: z.string().optional()
});

// Notification subscription validators
export const subscribeNotificationSchema = z.object({
  animeId: z.string(),
  enabled: z.boolean().default(true)
});

// Recommendation validators
export const getRecommendationsSchema = z.object({
  limit: z.number().int().min(1).max(50).default(10)
});

// Playback queue validators
export const getPlaybackQueueSchema = z.object({
  animeId: z.string(),
  limit: z.number().int().min(1).max(50).default(5)
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const data = schema.parse({
        ...req.query,
        ...req.body,
        ...req.params
      });
      req.validatedData = data;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        });
      }
      res.status(400).json({ error: 'Invalid request' });
    }
  };
};
