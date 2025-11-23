# Animeflix Architecture Guide

## Table of Contents
- [English](#english)
- [Français](#français)

---

## English

### Overview

Animeflix is a real-time anime streaming platform built with modern web technologies. It features live comments, trending analytics, and push notifications synchronized across multiple client sessions using Socket.io.

### Technology Stack

**Backend:**
- Node.js with Express.js
- Socket.io for real-time communication
- In-memory storage (can be extended to Redis/MongoDB)

**Frontend:**
- React 18+ with Vite
- Socket.io-client for real-time updates
- Zustand for state management
- Modern CSS with responsive design

**Infrastructure:**
- Docker for containerization
- Environment-based configuration

### Architecture Components

#### Backend Architecture

```
packages/server/
├── src/
│   └── index.js          # Main server with Socket.io setup
├── package.json
└── .env                  # Configuration
```

**Key Features:**

1. **Socket.io Namespaces & Rooms**
   - Rooms format: `anime:{animeId}:episode:{episodeId}`
   - Enables isolated chat channels per episode
   - Automatic user tracking per room

2. **Real-time Events**
   - `join-room`: User joins a chat room
   - `send-comment`: Broadcast new comments
   - `like-comment`: Update comment likes
   - `typing`: Show typing indicator
   - `send-notification`: Push notifications
   - `trend-update`: Update trending counter

3. **Data Persistence**
   - Comments stored in-memory Map
   - Can be extended to database
   - Automatic cleanup possible

4. **Trend Tracking**
   - Comments increment trend counters
   - Real-time trend broadcasting
   - Top 10 trends ranking

#### Frontend Architecture

```
packages/client/
├── src/
│   ├── components/       # React components
│   │   ├── ChatOverlay.jsx
│   │   ├── TrendsTicker.jsx
│   │   ├── NotificationBell.jsx
│   │   └── RecommendationPanel.jsx
│   ├── services/
│   │   └── socket.js     # Socket.io integration
│   ├── store/
│   │   └── index.js      # Zustand store
│   └── App.jsx           # Main app
├── index.html
└── vite.config.js
```

**State Management:**
- Centralized Zustand store
- Reactive UI updates
- Comment caching
- Trend tracking
- Notification queue

### Data Flow

#### Comment Flow
1. User types in chat input
2. Frontend emits `send-comment` event
3. Server receives and stores comment
4. Server broadcasts to all users in room
5. Frontend updates local state
6. UI re-renders with new comment

#### Notification Flow
1. Event triggered (e.g., new episode)
2. Server emits `send-notification` event
3. Frontend receives and stores notification
4. Browser notification API triggered if permitted
5. Notification appears in bell dropdown

#### Trend Flow
1. New comment increments trend counter
2. Server broadcasts `trend-update` event
3. Frontend updates trends in store
4. TrendsTicker component re-renders
5. Sorted by count in real-time

### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── UserInfo
│   └── NotificationBell
│       └── NotificationCenter
├── Controls
│   ├── AnimeSelector
│   ├── EpisodeSelector
│   └── ActionButtons
└── ContentLayout
    ├── TrendsTicker
    ├── ChatOverlay (when active)
    └── RecommendationPanel
```

### Real-time Synchronization

**Multi-Tab Sync:**
- All connected clients in a room receive updates instantly
- Comments appear synchronously across tabs
- Trends update in real-time
- Active user count updates

**Connection Handling:**
- Automatic reconnection attempts
- Connection state management
- Error recovery
- Graceful disconnection

---

## Français

### Aperçu

Animeflix est une plateforme de streaming d'anime en temps réel construite avec les technologies web modernes. Elle dispose de commentaires en direct, d'analyses de tendances et de notifications push synchronisées sur plusieurs sessions client à l'aide de Socket.io.

### Pile Technologique

**Backend:**
- Node.js avec Express.js
- Socket.io pour la communication en temps réel
- Stockage en mémoire (peut être étendu à Redis/MongoDB)

**Frontend:**
- React 18+ avec Vite
- Socket.io-client pour les mises à jour en temps réel
- Zustand pour la gestion d'état
- CSS moderne avec design réactif

**Infrastructure:**
- Docker pour la conteneurisation
- Configuration basée sur l'environnement

### Composants de l'Architecture

#### Architecture Backend

```
packages/server/
├── src/
│   └── index.js          # Serveur principal avec Socket.io
├── package.json
└── .env                  # Configuration
```

**Caractéristiques principales:**

1. **Espaces de noms et salles Socket.io**
   - Format des salles: `anime:{animeId}:episode:{episodeId}`
   - Channels de chat isolés par épisode
   - Suivi automatique des utilisateurs par salle

2. **Événements en temps réel**
   - `join-room`: L'utilisateur rejoint une salle de chat
   - `send-comment`: Diffuser les nouveaux commentaires
   - `like-comment`: Mettre à jour les mentions j'aime des commentaires
   - `typing`: Afficher l'indicateur de saisie
   - `send-notification`: Notifications push
   - `trend-update`: Mettre à jour le compteur de tendances

3. **Persistance des données**
   - Commentaires stockés en mémoire Map
   - Peut être étendu à la base de données
   - Nettoyage automatique possible

4. **Suivi des tendances**
   - Les commentaires incrémentent les compteurs de tendances
   - Diffusion des tendances en temps réel
   - Classement des 10 meilleures tendances

#### Architecture Frontend

```
packages/client/
├── src/
│   ├── components/       # Composants React
│   │   ├── ChatOverlay.jsx
│   │   ├── TrendsTicker.jsx
│   │   ├── NotificationBell.jsx
│   │   └── RecommendationPanel.jsx
│   ├── services/
│   │   └── socket.js     # Intégration Socket.io
│   ├── store/
│   │   └── index.js      # Magasin Zustand
│   └── App.jsx           # Application principale
├── index.html
└── vite.config.js
```

**Gestion d'état:**
- Stockage Zustand centralisé
- Mises à jour réactives de l'interface utilisateur
- Cache des commentaires
- Suivi des tendances
- File d'attente de notifications

### Flux de données

#### Flux de commentaires
1. L'utilisateur tape dans le champ de saisie de chat
2. Le frontend émet l'événement `send-comment`
3. Le serveur reçoit et stocke le commentaire
4. Le serveur diffuse à tous les utilisateurs de la salle
5. Le frontend met à jour l'état local
6. L'interface utilisateur se réaffiche avec le nouveau commentaire

#### Flux de notifications
1. Événement déclenché (par exemple, nouvel épisode)
2. Le serveur émet l'événement `send-notification`
3. Le frontend reçoit et stocke la notification
4. L'API de notification du navigateur est déclenchée si autorisée
5. La notification apparaît dans le menu déroulant de la cloche

#### Flux de tendances
1. Le nouveau commentaire incrémente le compteur de tendances
2. Le serveur diffuse l'événement `trend-update`
3. Le frontend met à jour les tendances dans le store
4. Le composant TrendsTicker se réaffiche
5. Trié par nombre en temps réel

### Hiérarchie des composants

```
App
├── Header
│   ├── Logo
│   ├── UserInfo
│   └── NotificationBell
│       └── NotificationCenter
├── Controls
│   ├── AnimeSelector
│   ├── EpisodeSelector
│   └── ActionButtons
└── ContentLayout
    ├── TrendsTicker
    ├── ChatOverlay (quand actif)
    └── RecommendationPanel
```

### Synchronisation en temps réel

**Sync multi-onglets:**
- Tous les clients connectés dans une salle reçoivent les mises à jour instantanément
- Les commentaires apparaissent de manière synchrone entre les onglets
- Les tendances se mettent à jour en temps réel
- Le nombre d'utilisateurs actifs se met à jour

**Gestion de la connexion:**
- Tentatives de reconnexion automatiques
- Gestion de l'état de connexion
- Récupération des erreurs
- Déconnexion gracieuse
