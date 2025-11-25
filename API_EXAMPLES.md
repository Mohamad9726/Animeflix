# Animeflix API - Practical Examples

This document provides practical examples of using the Animeflix API with complete payloads and responses.

## Table of Contents
- [Authentication Flow](#authentication-flow)
- [Catalog Operations](#catalog-operations)
- [User Personalization](#user-personalization)
- [Advanced Workflows](#advanced-workflows)

---

## Authentication Flow

### 1. Register a New User

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "MySecurePassword123!",
    "username": "alice_anime"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alice@example.com",
    "username": "alice_anime"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDUzMzg0MDAsImV4cCI6MTcwNTM0MjAwMH0.ABCD1234...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDUzMzg0MDAsImV4cCI6MTcwNjAwMDAwMH0.EFGH5678..."
}
```

### 2. Login with Credentials

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "MySecurePassword123!"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alice@example.com",
    "username": "alice_anime"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Refresh Expired Token

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Catalog Operations

### 1. Search Anime by Title

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/catalog/search?query=Death%20Note&page=1&limit=5"
```

**Response:**
```json
{
  "data": [
    {
      "id": "anime-2",
      "title": "Death Note",
      "description": "A high school student discovers a supernatural notebook that allows him to kill anyone",
      "genres": ["Mystery", "Supernatural", "Thriller"],
      "tags": ["Psychological", "Mind Games", "Dark"],
      "rating": 8.8,
      "status": "completed",
      "totalEpisodes": 37,
      "coverImage": "https://via.placeholder.com/300x400?text=DeathNote",
      "releaseDate": "2006-10-03",
      "studio": "Madhouse"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 5,
  "pages": 1
}
```

### 2. Filter Anime by Multiple Criteria

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/catalog/search?genres=Action&genres=Adventure&status=ongoing&sortBy=rating&limit=10"
```

**Response:**
```json
{
  "data": [
    {
      "id": "anime-3",
      "title": "Demon Slayer",
      "description": "A young man trains to become a demon slayer to save his sister",
      "genres": ["Action", "Adventure", "Supernatural"],
      "tags": ["Beautiful Animation", "Intense Battles", "Emotional"],
      "rating": 8.7,
      "status": "ongoing",
      "totalEpisodes": 50,
      "coverImage": "https://via.placeholder.com/300x400?text=DemonSlayer",
      "releaseDate": "2019-04-06",
      "studio": "Ufotable"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### 3. Get Anime Details with Episode List

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/catalog/anime/anime-1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "id": "anime-1",
  "title": "Attack on Titan",
  "description": "Humanity fights for survival against giant humanoid creatures called Titans",
  "genres": ["Action", "Drama", "Fantasy"],
  "tags": ["Dark", "Intense", "Gore"],
  "rating": 9.0,
  "status": "completed",
  "totalEpisodes": 139,
  "coverImage": "https://via.placeholder.com/300x400?text=AOT",
  "releaseDate": "2013-04-07",
  "studio": "Wit Studio",
  "episodes": [
    {
      "id": "anime-1-ep-1",
      "animeId": "anime-1",
      "episodeNumber": 1,
      "title": "Episode 1",
      "description": "Season episode 1",
      "duration": 24,
      "airDate": "2013-04-07",
      "rating": 7.8
    },
    {
      "id": "anime-1-ep-2",
      "animeId": "anime-1",
      "episodeNumber": 2,
      "title": "Episode 2",
      "description": "Season episode 2",
      "duration": 24,
      "airDate": "2013-04-14",
      "rating": 8.1
    }
  ]
}
```

### 4. Get All Available Genres

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/catalog/genres"
```

**Response:**
```json
{
  "genres": [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Mecha",
    "Mystery",
    "Sci-Fi",
    "Supernatural",
    "Thriller"
  ]
}
```

---

## User Personalization

### 1. Build a Watchlist

**Add to Watchlist:**
```bash
curl -X POST http://localhost:3000/api/v1/watchlist/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "animeId": "anime-1",
    "status": "watching"
  }'
```

**Response:**
```json
{
  "success": true
}
```

**Add Multiple Items:**
```bash
# Add Attack on Titan - watching
curl -X POST http://localhost:3000/api/v1/watchlist/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"animeId": "anime-1", "status": "watching"}'

# Add Death Note - watching
curl -X POST http://localhost:3000/api/v1/watchlist/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"animeId": "anime-2", "status": "watching"}'

# Add Demon Slayer - planning to watch
curl -X POST http://localhost:3000/api/v1/watchlist/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"animeId": "anime-3", "status": "on-hold"}'
```

**Retrieve Watchlist:**
```bash
curl -X GET http://localhost:3000/api/v1/watchlist \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "watchlist": [
    {
      "animeId": "anime-1",
      "anime": {
        "id": "anime-1",
        "title": "Attack on Titan",
        "rating": 9.0,
        "genres": ["Action", "Drama", "Fantasy"]
      },
      "status": "watching",
      "addedAt": "2024-01-15T10:30:00Z"
    },
    {
      "animeId": "anime-2",
      "anime": {
        "id": "anime-2",
        "title": "Death Note",
        "rating": 8.8,
        "genres": ["Mystery", "Supernatural", "Thriller"]
      },
      "status": "watching",
      "addedAt": "2024-01-15T10:31:00Z"
    },
    {
      "animeId": "anime-3",
      "anime": {
        "id": "anime-3",
        "title": "Demon Slayer",
        "rating": 8.7,
        "genres": ["Action", "Adventure", "Supernatural"]
      },
      "status": "on-hold",
      "addedAt": "2024-01-15T10:32:00Z"
    }
  ]
}
```

### 2. Track Watch History

**Record a Watch Session:**
```bash
curl -X POST http://localhost:3000/api/v1/watch-history/record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "animeId": "anime-1",
    "episodeId": "anime-1-ep-1",
    "position": 1200,
    "duration": 1440
  }'
```

**Response:**
```json
{
  "success": true
}
```

**Get Watch History:**
```bash
curl -X GET http://localhost:3000/api/v1/watch-history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "history": [
    {
      "animeId": "anime-1",
      "episodeId": "anime-1-ep-1",
      "watchedAt": "2024-01-15T15:30:00Z",
      "position": 1200
    },
    {
      "animeId": "anime-1",
      "episodeId": "anime-1-ep-2",
      "watchedAt": "2024-01-15T16:00:00Z",
      "position": 0
    }
  ]
}
```

### 3. Rate and Review Anime

**Submit a Rating:**
```bash
curl -X POST http://localhost:3000/api/v1/ratings/anime-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "rating": 9,
    "review": "Absolutely amazing series! The plot twists and character development are incredible. Highly recommended!"
  }'
```

**Response:**
```json
{
  "success": true
}
```

**Retrieve User Rating:**
```bash
curl -X GET http://localhost:3000/api/v1/ratings/anime-1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "rating": {
    "rating": 9,
    "review": "Absolutely amazing series! The plot twists and character development are incredible. Highly recommended!",
    "ratedAt": "2024-01-15T12:00:00Z"
  }
}
```

### 4. Manage Favorites

**Add to Favorites:**
```bash
curl -X POST http://localhost:3000/api/v1/favorites/anime-1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Favorites:**
```bash
curl -X GET http://localhost:3000/api/v1/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "favorites": [
    {
      "id": "anime-1",
      "title": "Attack on Titan",
      "rating": 9.0,
      "genres": ["Action", "Drama", "Fantasy"],
      "status": "completed",
      "totalEpisodes": 139
    }
  ]
}
```

**Remove from Favorites:**
```bash
curl -X DELETE http://localhost:3000/api/v1/favorites/anime-1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Advanced Workflows

### 1. Get Personalized Recommendations

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/recommendations?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "recommendations": [
    {
      "animeId": "anime-4",
      "anime": {
        "id": "anime-4",
        "title": "Steins;Gate",
        "description": "A group of friends discovers a way to send messages to the past",
        "genres": ["Sci-Fi", "Thriller", "Drama"],
        "rating": 9.1,
        "status": "completed",
        "totalEpisodes": 24
      },
      "similarity": 2,
      "reason": "Similar to your watched anime"
    },
    {
      "animeId": "anime-5",
      "anime": {
        "id": "anime-5",
        "title": "Neon Genesis Evangelion",
        "description": "Teenagers pilot giant robots to fight invading aliens",
        "genres": ["Mecha", "Sci-Fi", "Drama"],
        "rating": 7.9,
        "status": "completed",
        "totalEpisodes": 26
      },
      "similarity": 1,
      "reason": "Similar to your watched anime"
    }
  ]
}
```

### 2. Get Playback Queue for Anime

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/playback-queue/anime-1?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "queue": [
    {
      "id": "anime-1-ep-3",
      "animeId": "anime-1",
      "episodeNumber": 3,
      "title": "Episode 3",
      "description": "Season episode 3",
      "duration": 24,
      "airDate": "2013-04-21",
      "rating": 8.3,
      "status": "queued"
    },
    {
      "id": "anime-1-ep-4",
      "animeId": "anime-1",
      "episodeNumber": 4,
      "title": "Episode 4",
      "description": "Season episode 4",
      "duration": 24,
      "airDate": "2013-04-28",
      "rating": 8.2,
      "status": "queued"
    }
  ]
}
```

### 3. Subscribe to Episode Notifications

**Subscribe:**
```bash
curl -X POST http://localhost:3000/api/v1/notifications/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"animeId": "anime-1"}'
```

**Get Subscriptions:**
```bash
curl -X GET http://localhost:3000/api/v1/notifications/subscriptions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "subscriptions": [
    {
      "id": "anime-1",
      "title": "Attack on Titan",
      "genres": ["Action", "Drama", "Fantasy"]
    }
  ]
}
```

### 4. Complete User Journey

**Step 1: Register**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "username": "myuser"
  }' | jq -r '.token')
```

**Step 2: Search for Anime**
```bash
curl -X GET "http://localhost:3000/api/v1/catalog/search?query=Attack&limit=5"
```

**Step 3: Add to Watchlist**
```bash
curl -X POST http://localhost:3000/api/v1/watchlist/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"animeId": "anime-1", "status": "watching"}'
```

**Step 4: Get Anime Details**
```bash
curl -X GET "http://localhost:3000/api/v1/catalog/anime/anime-1" \
  -H "Authorization: Bearer $TOKEN"
```

**Step 5: Record Watch**
```bash
curl -X POST http://localhost:3000/api/v1/watch-history/record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "animeId": "anime-1",
    "episodeId": "anime-1-ep-1",
    "position": 1200
  }'
```

**Step 6: Rate Anime**
```bash
curl -X POST http://localhost:3000/api/v1/ratings/anime-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating": 9, "review": "Amazing!"}'
```

**Step 7: Get Recommendations**
```bash
curl -X GET "http://localhost:3000/api/v1/recommendations?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Handling Examples

### Invalid Email Registration
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "SecurePass123",
    "username": "user"
  }'
```

**Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Missing Authorization Token
```bash
curl -X GET http://localhost:3000/api/v1/watchlist
```

**Response (401):**
```json
{
  "error": "Access token required"
}
```

### Invalid Rating Value
```bash
curl -X POST http://localhost:3000/api/v1/ratings/anime-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"rating": 11, "review": "Out of range!"}'
```

**Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": "rating",
      "message": "Number must be less than or equal to 10"
    }
  ]
}
```

---

## Tips for Testing

### Using JavaScript/Node.js

```javascript
const API_URL = 'http://localhost:3000/api/v1';

async function registerUser() {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'SecurePass123',
      username: 'testuser'
    })
  });
  return response.json();
}

async function searchAnime(query) {
  const response = await fetch(`${API_URL}/catalog/search?query=${query}`);
  return response.json();
}

async function addToWatchlist(token, animeId) {
  const response = await fetch(`${API_URL}/watchlist/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      animeId,
      status: 'watching'
    })
  });
  return response.json();
}

// Usage
const user = await registerUser();
const results = await searchAnime('Attack');
await addToWatchlist(user.token, 'anime-1');
```

### Postman Collection

Import this collection into Postman for easy testing:

1. Open Postman
2. Create a new collection "Animeflix API"
3. Add requests for each endpoint listed in API_ROUTES.md
4. Set `{{token}}` as variable in Authorization headers
5. Use pre-request scripts to handle authentication flow
