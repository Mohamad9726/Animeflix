# Animeflix API - Quick Start Guide

Get started with the Animeflix REST API in 5 minutes!

## Prerequisites
- Node.js 16+
- npm or yarn
- Postman or cURL (for testing)

## Installation & Setup

### 1. Install Dependencies
```bash
cd packages/server
npm install
```

### 2. Configure Environment
```bash
# Copy and edit .env.example if needed
cp .env.example .env
```

### 3. Start Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Documentation

### Interactive Docs
Visit: `http://localhost:3000/api-docs`

### Base URL
```
http://localhost:3000/api/v1
```

## 5-Minute Tutorial

### Step 1: Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "MyPassword123",
    "username": "alice"
  }'
```

**Save the token from response:**
```json
{
  "user": { "id": "...", "email": "alice@example.com", "username": "alice" },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Step 2: Search for Anime
```bash
curl -X GET "http://localhost:3000/api/v1/catalog/search?query=Attack"
```

Response:
```json
{
  "data": [
    {
      "id": "anime-1",
      "title": "Attack on Titan",
      "rating": 9.0,
      "genres": ["Action", "Drama", "Fantasy"],
      "totalEpisodes": 139
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "pages": 1
}
```

### Step 3: Add to Watchlist
```bash
TOKEN="eyJhbGc..." # Replace with your token

curl -X POST http://localhost:3000/api/v1/watchlist/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"animeId": "anime-1", "status": "watching"}'
```

Response:
```json
{ "success": true }
```

### Step 4: Get Watchlist
```bash
curl -X GET http://localhost:3000/api/v1/watchlist \
  -H "Authorization: Bearer $TOKEN"
```

Response:
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

### Step 5: Get Recommendations
```bash
curl -X GET "http://localhost:3000/api/v1/recommendations?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "recommendations": [
    {
      "animeId": "anime-2",
      "anime": {
        "id": "anime-2",
        "title": "Death Note",
        "rating": 8.8,
        "genres": ["Mystery", "Supernatural", "Thriller"]
      },
      "similarity": 2,
      "reason": "Similar to your watched anime"
    }
  ]
}
```

## Common Operations

### Search with Filters
```bash
# Filter by genre and status
curl -X GET "http://localhost:3000/api/v1/catalog/search?genres=Action&status=completed&sortBy=rating"

# Multiple genres
curl -X GET "http://localhost:3000/api/v1/catalog/search?genres=Action&genres=Adventure"

# Pagination
curl -X GET "http://localhost:3000/api/v1/catalog/search?page=2&limit=10"
```

### Rate an Anime
```bash
curl -X POST http://localhost:3000/api/v1/ratings/anime-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rating": 9,
    "review": "Amazing series!"
  }'
```

### Track Watch History
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

### Get Next Episodes to Watch
```bash
curl -X GET "http://localhost:3000/api/v1/playback-queue/anime-1?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

### Manage Favorites
```bash
# Add to favorites
curl -X POST http://localhost:3000/api/v1/favorites/anime-1 \
  -H "Authorization: Bearer $TOKEN"

# Get favorites
curl -X GET http://localhost:3000/api/v1/favorites \
  -H "Authorization: Bearer $TOKEN"

# Remove from favorites
curl -X DELETE http://localhost:3000/api/v1/favorites/anime-1 \
  -H "Authorization: Bearer $TOKEN"
```

### Notification Subscriptions
```bash
# Subscribe to anime notifications
curl -X POST http://localhost:3000/api/v1/notifications/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"animeId": "anime-1"}'

# Get subscriptions
curl -X GET http://localhost:3000/api/v1/notifications/subscriptions \
  -H "Authorization: Bearer $TOKEN"

# Unsubscribe
curl -X POST http://localhost:3000/api/v1/notifications/unsubscribe/anime-1 \
  -H "Authorization: Bearer $TOKEN"
```

## Running Tests

```bash
cd packages/server
npm test
```

Tests cover all critical endpoints:
- Authentication (register, login, refresh)
- Catalog search with filters and pagination
- Watchlist CRUD operations
- Watch history
- Favorites management
- Ratings
- Notifications
- Recommendations
- And more!

## Authentication

All protected endpoints require a JWT token:

```bash
# In the Authorization header
Authorization: Bearer <your_token_here>
```

Tokens expire after 1 hour. Use the refresh token to get a new one:

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your_refresh_token"}'
```

## Error Handling

### Bad Request (400)
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

### Unauthorized (401)
```json
{
  "error": "Access token required"
}
```

### Not Found (404)
```json
{
  "error": "Anime not found"
}
```

## Tips & Tricks

### Using JavaScript/Node.js
```javascript
const API_URL = 'http://localhost:3000/api/v1';

async function registerAndSearch() {
  // Register
  const registerRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'SecurePass123',
      username: 'testuser'
    })
  });

  const { token } = await registerRes.json();

  // Search
  const searchRes = await fetch(
    `${API_URL}/catalog/search?query=Attack`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  const results = await searchRes.json();
  console.log(results.data);
}

registerAndSearch();
```

### Save Token to File
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123","username":"user"}' \
  | jq -r '.token')

echo $TOKEN > token.txt
TOKEN=$(cat token.txt)
```

### Use in Postman

1. Create new collection "Animeflix API"
2. Add variable: `{{token}}` and `{{base_url}}`
3. Set values:
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: (set after login)
4. Use `{{base_url}}/auth/login` in requests
5. Add `Authorization: Bearer {{token}}` to protected endpoints

## Sample Data

The API comes with 5 pre-loaded anime:

1. **Attack on Titan** - anime-1 (139 episodes)
2. **Death Note** - anime-2 (37 episodes)
3. **Demon Slayer** - anime-3 (50 episodes)
4. **Steins;Gate** - anime-4 (24 episodes)
5. **Neon Genesis Evangelion** - anime-5 (26 episodes)

Use these IDs in your requests!

## Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
npm install
```

### Tests Failing
```bash
# Make sure server is not running
# Then run tests
npm test
```

### Swagger Docs Not Loading
- Make sure server is running on port 3000
- Visit `http://localhost:3000/api-docs`

## Next Steps

1. Read full API documentation: [API_ROUTES.md](./API_ROUTES.md)
2. View practical examples: [API_EXAMPLES.md](./API_EXAMPLES.md)
3. Understand implementation: [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)
4. Check system architecture: [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

## Support

For detailed endpoint information, see [API_ROUTES.md](./API_ROUTES.md)

For complete implementation details, see [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)
