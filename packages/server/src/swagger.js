import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Animeflix API',
      version: '1.0.0',
      description: 'RESTful API for Animeflix - Real-time anime streaming platform',
      contact: {
        name: 'Animeflix Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.animeflix.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token for API authentication'
        }
      },
      schemas: {
        Anime: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            genres: { type: 'array', items: { type: 'string' } },
            tags: { type: 'array', items: { type: 'string' } },
            rating: { type: 'number' },
            status: { type: 'string', enum: ['ongoing', 'completed', 'upcoming'] },
            totalEpisodes: { type: 'number' },
            coverImage: { type: 'string' },
            releaseDate: { type: 'string' },
            studio: { type: 'string' }
          }
        },
        Episode: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            animeId: { type: 'string' },
            episodeNumber: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            duration: { type: 'number' },
            airDate: { type: 'string' },
            rating: { type: 'number' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            createdAt: { type: 'string' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string' },
            refreshToken: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes.js']
};

export const swaggerSpec = swaggerJsdoc(options);
