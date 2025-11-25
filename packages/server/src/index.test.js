import request from 'supertest';
import express from 'express';
import { createServer } from 'http';
import apiRoutes from './routes.js';
import { errorHandler } from './middleware.js';
import { initializeSampleData, storage } from './models.js';

const app = express();
app.use(express.json());
app.use('/api/v1', apiRoutes);
app.use(errorHandler);

describe('Animeflix API Tests', () => {
  let token;
  let refreshToken;
  let userId;

  beforeAll(() => {
    initializeSampleData();
  });

  describe('Authentication Routes', () => {
    describe('POST /api/v1/auth/register', () => {
      it('should register a new user', async () => {
        const res = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'testuser@example.com',
            password: 'testPassword123',
            username: 'testuser'
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('refreshToken');
        expect(res.body.user.email).toBe('testuser@example.com');
        expect(res.body.user.username).toBe('testuser');

        userId = res.body.user.id;
        token = res.body.token;
        refreshToken = res.body.refreshToken;
      });

      it('should fail with invalid email', async () => {
        const res = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'invalid-email',
            password: 'testPassword123',
            username: 'testuser2'
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
      });

      it('should fail with short password', async () => {
        const res = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'newuser@example.com',
            password: 'short',
            username: 'testuser3'
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
      });

      it('should fail if user already exists', async () => {
        const res = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'testuser@example.com',
            password: 'testPassword123',
            username: 'duplicate'
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain('already exists');
      });
    });

    describe('POST /api/v1/auth/login', () => {
      it('should login with correct credentials', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'testuser@example.com',
            password: 'testPassword123'
          });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe('testuser@example.com');
      });

      it('should fail with wrong password', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'testuser@example.com',
            password: 'wrongPassword'
          });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
      });

      it('should fail with non-existent user', async () => {
        const res = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'testPassword123'
          });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
      });
    });

    describe('POST /api/v1/auth/refresh', () => {
      it('should refresh token with valid refresh token', async () => {
        const res = await request(app)
          .post('/api/v1/auth/refresh')
          .send({ refreshToken });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('refreshToken');
      });
    });
  });

  describe('Catalog Routes', () => {
    describe('GET /api/v1/catalog/search', () => {
      it('should return search results', async () => {
        const res = await request(app)
          .get('/api/v1/catalog/search')
          .query({ query: 'Attack', limit: 10, page: 1 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it('should filter by genre', async () => {
        const res = await request(app)
          .get('/api/v1/catalog/search')
          .query({ genres: 'Action', limit: 10, page: 1 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toBeGreaterThanOrEqual(0);
      });

      it('should filter by status', async () => {
        const res = await request(app)
          .get('/api/v1/catalog/search')
          .query({ status: 'completed', limit: 10, page: 1 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
      });

      it('should support pagination', async () => {
        const res1 = await request(app)
          .get('/api/v1/catalog/search')
          .query({ page: 1, limit: 2 });

        const res2 = await request(app)
          .get('/api/v1/catalog/search')
          .query({ page: 2, limit: 2 });

        expect(res1.status).toBe(200);
        expect(res2.status).toBe(200);
        expect(res1.body.data).not.toEqual(res2.body.data);
      });

      it('should sort by trending', async () => {
        const res = await request(app)
          .get('/api/v1/catalog/search')
          .query({ sortBy: 'trending', limit: 10 });

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
      });

      it('should sort by rating', async () => {
        const res = await request(app)
          .get('/api/v1/catalog/search')
          .query({ sortBy: 'rating', limit: 10 });

        expect(res.status).toBe(200);
        if (res.body.data.length > 1) {
          expect(res.body.data[0].rating).toBeGreaterThanOrEqual(res.body.data[1].rating);
        }
      });
    });

    describe('GET /api/v1/catalog/anime/:animeId', () => {
      it('should return anime with episodes', async () => {
        const res = await request(app)
          .get('/api/v1/catalog/anime/anime-1');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('title');
        expect(res.body).toHaveProperty('episodes');
        expect(Array.isArray(res.body.episodes)).toBe(true);
      });

      it('should fail with non-existent anime', async () => {
        const res = await request(app)
          .get('/api/v1/catalog/anime/non-existent');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
      });
    });

    describe('GET /api/v1/catalog/genres', () => {
      it('should return all genres', async () => {
        const res = await request(app)
          .get('/api/v1/catalog/genres');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('genres');
        expect(Array.isArray(res.body.genres)).toBe(true);
        expect(res.body.genres.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Watchlist Routes', () => {
    describe('POST /api/v1/watchlist/add', () => {
      it('should add anime to watchlist', async () => {
        const res = await request(app)
          .post('/api/v1/watchlist/add')
          .set('Authorization', `Bearer ${token}`)
          .send({
            animeId: 'anime-1',
            status: 'watching'
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success', true);
      });

      it('should fail without token', async () => {
        const res = await request(app)
          .post('/api/v1/watchlist/add')
          .send({
            animeId: 'anime-1',
            status: 'watching'
          });

        expect(res.status).toBe(401);
      });
    });

    describe('GET /api/v1/watchlist', () => {
      it('should return user watchlist', async () => {
        const res = await request(app)
          .get('/api/v1/watchlist')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('watchlist');
        expect(Array.isArray(res.body.watchlist)).toBe(true);
      });
    });

    describe('PATCH /api/v1/watchlist/:animeId', () => {
      it('should update watchlist status', async () => {
        const res = await request(app)
          .patch('/api/v1/watchlist/anime-1')
          .set('Authorization', `Bearer ${token}`)
          .send({ status: 'completed' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
      });
    });

    describe('DELETE /api/v1/watchlist/:animeId', () => {
      it('should remove anime from watchlist', async () => {
        const res = await request(app)
          .delete('/api/v1/watchlist/anime-1')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
      });
    });
  });

  describe('Watch History Routes', () => {
    describe('POST /api/v1/watch-history/record', () => {
      it('should record watched episode', async () => {
        const res = await request(app)
          .post('/api/v1/watch-history/record')
          .set('Authorization', `Bearer ${token}`)
          .send({
            animeId: 'anime-1',
            episodeId: 'anime-1-ep-1',
            position: 1200
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success', true);
      });
    });

    describe('GET /api/v1/watch-history', () => {
      it('should return watch history', async () => {
        const res = await request(app)
          .get('/api/v1/watch-history')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('history');
        expect(Array.isArray(res.body.history)).toBe(true);
      });
    });
  });

  describe('Favorites Routes', () => {
    describe('POST /api/v1/favorites/:animeId', () => {
      it('should add anime to favorites', async () => {
        const res = await request(app)
          .post('/api/v1/favorites/anime-1')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success', true);
      });
    });

    describe('GET /api/v1/favorites', () => {
      it('should return user favorites', async () => {
        const res = await request(app)
          .get('/api/v1/favorites')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('favorites');
        expect(Array.isArray(res.body.favorites)).toBe(true);
      });
    });

    describe('DELETE /api/v1/favorites/:animeId', () => {
      it('should remove anime from favorites', async () => {
        const res = await request(app)
          .delete('/api/v1/favorites/anime-1')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
      });
    });
  });

  describe('Ratings Routes', () => {
    describe('POST /api/v1/ratings/:animeId', () => {
      it('should submit a rating', async () => {
        const res = await request(app)
          .post('/api/v1/ratings/anime-1')
          .set('Authorization', `Bearer ${token}`)
          .send({
            rating: 8,
            review: 'Great anime!'
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success', true);
      });

      it('should fail with invalid rating', async () => {
        const res = await request(app)
          .post('/api/v1/ratings/anime-1')
          .set('Authorization', `Bearer ${token}`)
          .send({
            rating: 11,
            review: 'Great anime!'
          });

        expect(res.status).toBe(400);
      });
    });

    describe('GET /api/v1/ratings/:animeId', () => {
      it('should return user rating', async () => {
        const res = await request(app)
          .get('/api/v1/ratings/anime-1')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('rating');
      });
    });
  });

  describe('Notifications Routes', () => {
    describe('POST /api/v1/notifications/subscribe', () => {
      it('should subscribe to notifications', async () => {
        const res = await request(app)
          .post('/api/v1/notifications/subscribe')
          .set('Authorization', `Bearer ${token}`)
          .send({ animeId: 'anime-1' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('success', true);
      });
    });

    describe('GET /api/v1/notifications/subscriptions', () => {
      it('should return subscriptions', async () => {
        const res = await request(app)
          .get('/api/v1/notifications/subscriptions')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('subscriptions');
        expect(Array.isArray(res.body.subscriptions)).toBe(true);
      });
    });

    describe('POST /api/v1/notifications/unsubscribe/:animeId', () => {
      it('should unsubscribe from notifications', async () => {
        const res = await request(app)
          .post('/api/v1/notifications/unsubscribe/anime-1')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
      });
    });
  });

  describe('Recommendations Routes', () => {
    describe('GET /api/v1/recommendations', () => {
      it('should return recommendations', async () => {
        const res = await request(app)
          .get('/api/v1/recommendations')
          .set('Authorization', `Bearer ${token}`)
          .query({ limit: 10 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('recommendations');
        expect(Array.isArray(res.body.recommendations)).toBe(true);
      });
    });
  });

  describe('Playback Queue Routes', () => {
    describe('GET /api/v1/playback-queue/:animeId', () => {
      it('should return playback queue', async () => {
        await request(app)
          .post('/api/v1/watchlist/add')
          .set('Authorization', `Bearer ${token}`)
          .send({ animeId: 'anime-2', status: 'watching' });

        const res = await request(app)
          .get('/api/v1/playback-queue/anime-2')
          .set('Authorization', `Bearer ${token}`)
          .query({ limit: 5 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('queue');
        expect(Array.isArray(res.body.queue)).toBe(true);
      });
    });
  });
});
