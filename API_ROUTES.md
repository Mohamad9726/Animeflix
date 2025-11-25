# Animeflix API Routes Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## API Documentation
Interactive API documentation is available at: `http://localhost:3000/api-docs`

---

## Authentication Routes

### Register User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "username"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login User
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Refresh Token
**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Catalog Routes

### Search Anime
**Endpoint:** `GET /catalog/search`

**Query Parameters:**
- `query` (string, optional): Search by title or description
- `genres` (array, optional): Filter by genres (e.g., `?genres=Action&genres=Adventure`)
- `status` (string, optional): Filter by status (`ongoing`, `completed`, `upcoming`)
- `page` (number, default: 1): Page number for pagination
- `limit` (number, default: 20, max: 100): Items per page
- `sortBy` (string, optional): Sort by (`trending`, `rating`, `recent`)

**Example Request:**
```
GET /catalog/search?query=Attack&genres=Action&status=completed&page=1&limit=10&sortBy=rating
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "anime-1",
      "title": "Attack on Titan",
      "description": "Humanity fights for survival against giant humanoid creatures",
      "genres": ["Action", "Drama", "Fantasy"],
      "tags": ["Dark", "Intense", "Gore"],
      "rating": 9.0,
      "status": "completed",
      "totalEpisodes": 139,
      "coverImage": "https://...",
      "releaseDate": "2013-04-07",
      "studio": "Wit Studio"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "pages": 1
}
```

### Get Anime Details with Episodes
**Endpoint:** `GET /catalog/anime/{animeId}`

**Response (200):**
```json
{
  "id": "anime-1",
  "title": "Attack on Titan",
  "description": "Humanity fights for survival against giant humanoid creatures",
  "genres": ["Action", "Drama", "Fantasy"],
  "rating": 9.0,
  "status": "completed",
  "totalEpisodes": 139,
  "episodes": [
    {
      "id": "anime-1-ep-1",
      "animeId": "anime-1",
      "episodeNumber": 1,
      "title": "Episode 1",
      "description": "Season episode 1",
      "duration": 24,
      "airDate": "2013-04-07",
      "rating": 8.5
    }
  ]
}
```

### Get All Genres
**Endpoint:** `GET /catalog/genres`

**Response (200):**
```json
{
  "genres": ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Mystery", "Sci-Fi", "Supernatural", "Thriller"]
}
```

---

## Watchlist Routes (Protected)

### Add to Watchlist
**Endpoint:** `POST /watchlist/add`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "animeId": "anime-1",
  "status": "watching"
}
```

**Status Options:** `watching`, `completed`, `on-hold`, `dropped`

**Response (201):**
```json
{
  "success": true
}
```

### Get Watchlist
**Endpoint:** `GET /watchlist`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "watchlist": [
    {
      "animeId": "anime-1",
      "anime": {
        "id": "anime-1",
        "title": "Attack on Titan",
        "rating": 9.0
      },
      "status": "watching",
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Update Watchlist Item
**Endpoint:** `PATCH /watchlist/{animeId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true
}
```

### Remove from Watchlist
**Endpoint:** `DELETE /watchlist/{animeId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true
}
```

---

## Watch History Routes (Protected)

### Record Watch
**Endpoint:** `POST /watch-history/record`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "animeId": "anime-1",
  "episodeId": "anime-1-ep-1",
  "position": 1200,
  "duration": 1440
}
```

**Response (201):**
```json
{
  "success": true
}
```

### Get Watch History
**Endpoint:** `GET /watch-history`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "history": [
    {
      "animeId": "anime-1",
      "episodeId": "anime-1-ep-1",
      "watchedAt": "2024-01-15T15:30:00Z",
      "position": 1200
    }
  ]
}
```

---

## Favorites Routes (Protected)

### Add to Favorites
**Endpoint:** `POST /favorites/{animeId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "success": true
}
```

### Get Favorites
**Endpoint:** `GET /favorites`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "favorites": [
    {
      "id": "anime-1",
      "title": "Attack on Titan",
      "rating": 9.0,
      "genres": ["Action", "Drama"]
    }
  ]
}
```

### Remove from Favorites
**Endpoint:** `DELETE /favorites/{animeId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true
}
```

---

## Ratings Routes (Protected)

### Submit Rating
**Endpoint:** `POST /ratings/{animeId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "rating": 8,
  "review": "Great anime with amazing action scenes!"
}
```

**Response (201):**
```json
{
  "success": true
}
```

### Get User's Rating
**Endpoint:** `GET /ratings/{animeId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "rating": {
    "rating": 8,
    "review": "Great anime with amazing action scenes!",
    "ratedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## Notifications Routes (Protected)

### Subscribe to Notifications
**Endpoint:** `POST /notifications/subscribe`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "animeId": "anime-1"
}
```

**Response (201):**
```json
{
  "success": true
}
```

### Get Subscriptions
**Endpoint:** `GET /notifications/subscriptions`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "subscriptions": [
    {
      "id": "anime-1",
      "title": "Attack on Titan",
      "genres": ["Action", "Drama"]
    }
  ]
}
```

### Unsubscribe from Notifications
**Endpoint:** `POST /notifications/unsubscribe/{animeId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true
}
```

---

## Recommendations Routes (Protected)

### Get Personalized Recommendations
**Endpoint:** `GET /recommendations`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (number, default: 10, max: 50): Number of recommendations

**Response (200):**
```json
{
  "recommendations": [
    {
      "animeId": "anime-2",
      "anime": {
        "id": "anime-2",
        "title": "Death Note",
        "rating": 8.8,
        "genres": ["Mystery", "Supernatural"]
      },
      "similarity": 2,
      "reason": "Similar to your watched anime"
    }
  ]
}
```

---

## Playback Queue Routes (Protected)

### Get Playback Queue
**Endpoint:** `GET /playback-queue/{animeId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (number, default: 5, max: 50): Number of episodes in queue

**Response (200):**
```json
{
  "queue": [
    {
      "id": "anime-1-ep-1",
      "animeId": "anime-1",
      "episodeNumber": 1,
      "title": "Episode 1",
      "duration": 24,
      "airDate": "2013-04-07",
      "status": "queued"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
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

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 404 Not Found
```json
{
  "error": "Anime not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Testing Examples

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "username": "testuser"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

**Search Anime:**
```bash
curl -X GET "http://localhost:3000/api/v1/catalog/search?query=Attack&limit=10"
```

**Add to Watchlist:**
```bash
curl -X POST http://localhost:3000/api/v1/watchlist/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "animeId": "anime-1",
    "status": "watching"
  }'
```

### Using JavaScript/Fetch

```javascript
// Register
const registerResponse = await fetch('http://localhost:3000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123',
    username: 'testuser'
  })
});

const { token } = await registerResponse.json();

// Search anime
const searchResponse = await fetch(
  'http://localhost:3000/api/v1/catalog/search?query=Attack&limit=10'
);
const { data, total } = await searchResponse.json();

// Add to watchlist
const watchlistResponse = await fetch(
  'http://localhost:3000/api/v1/watchlist/add',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      animeId: 'anime-1',
      status: 'watching'
    })
  }
);
```

---

## Running Tests

```bash
cd packages/server
npm test
```

Tests cover:
- User authentication (register, login, refresh)
- Catalog search with filters and pagination
- Watchlist CRUD operations
- Watch history tracking
- Favorites management
- Ratings submission
- Notification subscriptions
- Recommendations
- Playback queue generation

---

## Security Notes

- All protected endpoints require JWT tokens in the `Authorization` header
- Tokens expire after 1 hour (configurable via `JWT_EXPIRY`)
- Refresh tokens expire after 7 days (configurable via `JWT_REFRESH_EXPIRY`)
- Change `JWT_SECRET` and `JWT_REFRESH_SECRET` in production
- Passwords are hashed using bcryptjs
- All inputs are validated using Zod
