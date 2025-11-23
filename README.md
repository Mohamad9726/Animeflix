# Animeflix - Real-time Anime Streaming Platform

## Table of Contents

### English
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

### Français
- [Aperçu](#aperçu)
- [Démarrage rapide](#démarrage-rapide)
- [Fonctionnalités](#fonctionnalités)
- [Documentation](#documentation-fr)
- [Structure du projet](#structure-du-projet)
- [Développement](#développement)
- [Tests](#tests)
- [Déploiement](#déploiement)

---

## English

### Overview

Animeflix is a modern real-time anime streaming platform featuring:

- **Live Comments** - Synchronized chat for all viewers
- **Real-time Trends** - Dynamic trending anime based on comment activity
- **Push Notifications** - Browser and in-app notifications for new episodes
- **Recommendations** - Personalized anime suggestions
- **Multi-user Sync** - Seamless experience across multiple devices/tabs

Built with **Node.js**, **Express**, **Socket.io**, **React**, and **Zustand**.

### Quick Start

#### Prerequisites
- Node.js 16+
- npm or yarn

#### Installation

```bash
# Clone the repository
git clone <repository-url>
cd animeflix

# Install dependencies
npm install

# Install package dependencies
cd packages/server && npm install && cd ..
cd packages/client && npm install && cd ..
```

#### Running Development Mode

```bash
# From project root
npm run dev

# Server will be at: http://localhost:3000
# Client will be at: http://localhost:5173
```

#### Testing Real-time Features

1. Open `http://localhost:5173` in two browser tabs or windows
2. In both tabs, select the same anime and episode
3. Click "Join Room" in both tabs
4. Send a message from one tab - see it appear instantly in the other
5. Watch trends and active user count sync in real-time

### Features

#### 1. Live Comments
- Real-time chat with typing indicators
- Synchronized across multiple tabs/browsers
- Comment timestamps and user information
- Active user presence tracking

#### 2. Real-time Trends
- Top 10 trending anime
- Ranked by comment activity
- Updated instantly across all users
- Visual ranking indicators

#### 3. Push Notifications
- Browser notifications when enabled
- In-app notification center with dropdown
- Unread notification badge
- Notification history with timestamps

#### 4. Recommendations
- Suggested anime based on trends
- Personalized watch queue
- Episode and status information
- Quick access panel on right sidebar

#### 5. Multi-Device Support
- Automatic synchronization
- Works across tabs, browsers, and devices
- Responsive design
- Touch-friendly interface

### Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design and component overview (EN/FR)
- **[SETUP.md](./docs/SETUP.md)** - Installation and configuration guide (EN/FR)
- **[FEATURES.md](./docs/FEATURES.md)** - Complete features and user guide (EN/FR)
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment guide (EN/FR)

### Project Structure

```
animeflix/
├── packages/
│   ├── server/                  # Backend application
│   │   ├── src/
│   │   │   └── index.js         # Main server with Socket.io
│   │   ├── package.json
│   │   └── .env                 # Server configuration
│   │
│   └── client/                  # Frontend application
│       ├── src/
│       │   ├── components/      # React components
│       │   │   ├── ChatOverlay.jsx
│       │   │   ├── TrendsTicker.jsx
│       │   │   ├── NotificationBell.jsx
│       │   │   └── RecommendationPanel.jsx
│       │   ├── services/
│       │   │   └── socket.js    # Socket.io client
│       │   ├── store/
│       │   │   └── index.js     # Zustand state
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── FEATURES.md
│   └── DEPLOYMENT.md
│
├── package.json                  # Root package
└── README.md                     # This file
```

### Development

#### Available Scripts

```bash
# Development mode (runs server and client concurrently)
npm run dev

# Server only
npm run dev:server

# Client only
npm run dev:client

# Build both packages
npm run build

# Build server
npm run build:server

# Build client
npm run build:client

# Start production server
npm start

# Run tests
npm run test
```

#### Making Changes

1. Server changes:
   - Edit files in `packages/server/src/`
   - Server auto-restarts with `--watch`

2. Client changes:
   - Edit files in `packages/client/src/`
   - Hot module replacement active
   - Changes reflect immediately

3. Add dependencies:
   ```bash
   cd packages/server
   npm install <package-name>
   ```

#### Socket.io Events

**Emitted by Client:**
- `join-room` - Join a chat room
- `send-comment` - Send a message
- `like-comment` - Like a comment
- `typing` - Indicate typing
- `stop-typing` - Stop typing indicator
- `leave-room` - Leave the room

**Received by Client:**
- `new-comment` - New message in room
- `user-joined` - User joined room
- `user-left` - User left room
- `user-typing` - User is typing
- `user-stop-typing` - User stopped typing
- `comment-liked` - Comment was liked
- `trend-update` - Trend data updated
- `notification` - New notification received

### Testing

#### Manual Testing

1. **Multi-tab sync:**
   ```bash
   npm run dev
   # Open http://localhost:5173 in two tabs
   # Join same room in both
   # Send message in one tab
   # Verify appears in other tab instantly
   ```

2. **Trend updates:**
   - Send multiple comments
   - Watch trends update in real-time
   - Verify ranking changes

3. **Notifications:**
   - Click "Test Notification"
   - Check bell icon updates
   - Check browser notification (if permitted)

4. **User presence:**
   - Join with multiple tabs
   - Watch active user count change
   - Leave and rejoin to verify updates

#### Browser DevTools

- Open Network tab to see Socket.io events
- Open Console to see connection logs
- Use Redux DevTools (if added) for state inspection

### Deployment

#### Docker Deployment

```bash
# Build image
docker build -t animeflix .

# Run container
docker run -p 3000:3000 animeflix
```

#### Production Build

```bash
# Build both packages
npm run build

# Start production server
PORT=3000 npm start
```

#### Environment Variables

Create `.env` in `packages/server/`:

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

For detailed deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Tips

1. Use browser DevTools to monitor WebSocket connections
2. Monitor memory usage with multiple connected clients
3. Trends update efficiently with real-time broadcasting
4. Comments stored in-memory (consider database for scale)

### Known Limitations

- Comments stored in-memory only (lost on server restart)
- Single server instance (use Redis for multi-instance)
- No user authentication (recommended for production)
- No database persistence (can be added)

### Future Enhancements

- Database persistence (MongoDB/PostgreSQL)
- Redis for scalability
- User authentication and profiles
- Private messaging
- Video streaming integration
- Advanced recommendation algorithms
- Analytics dashboard

### Troubleshooting

**Socket connection fails:**
- Verify server is running on port 3000
- Check browser console for errors
- Ensure CORS settings are correct

**Messages not syncing:**
- Check WebSocket connection in Network tab
- Verify you're in the same room
- Try refreshing the page

**Notifications not showing:**
- Grant browser notification permission
- Check browser notification settings
- Verify `/api/notifications` endpoint is working

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### License

MIT License

---

## Français

### Aperçu

Animeflix est une plateforme moderne de streaming d'anime en temps réel avec:

- **Commentaires en direct** - Chat synchronisé pour tous les spectateurs
- **Tendances en temps réel** - Anime en tendance dynamique basée sur l'activité des commentaires
- **Notifications push** - Notifications du navigateur et in-app pour les nouveaux épisodes
- **Recommandations** - Suggestions d'anime personnalisées
- **Sync multi-utilisateurs** - Expérience transparente sur plusieurs appareils/onglets

Construit avec **Node.js**, **Express**, **Socket.io**, **React** et **Zustand**.

### Démarrage rapide

#### Prérequis
- Node.js 16+
- npm ou yarn

#### Installation

```bash
# Cloner le référentiel
git clone <repository-url>
cd animeflix

# Installer les dépendances
npm install

# Installer les dépendances des packages
cd packages/server && npm install && cd ..
cd packages/client && npm install && cd ..
```

#### Mode développement

```bash
# À partir de la racine du projet
npm run dev

# Le serveur sera à: http://localhost:3000
# Le client sera à: http://localhost:5173
```

#### Test des fonctionnalités en temps réel

1. Ouvrez `http://localhost:5173` dans deux onglets ou fenêtres de navigateur
2. Dans les deux onglets, sélectionnez le même anime et épisode
3. Cliquez sur "Join Room" dans les deux onglets
4. Envoyez un message depuis un onglet - voyez-le apparaître instantanément dans l'autre
5. Regardez les tendances et le nombre d'utilisateurs actifs se synchroniser en temps réel

### Fonctionnalités

#### 1. Commentaires en direct
- Chat en temps réel avec indicateurs de saisie
- Synchronisé sur plusieurs onglets/navigateurs
- Horodatages des commentaires et informations sur les utilisateurs
- Suivi de la présence des utilisateurs actifs

#### 2. Tendances en temps réel
- Top 10 anime en tendance
- Classé par activité des commentaires
- Mis à jour instantanément pour tous les utilisateurs
- Indicateurs de classement visuels

#### 3. Notifications push
- Notifications du navigateur quand activées
- Centre de notifications in-app avec menu déroulant
- Badge de notification non lue
- Historique de notifications avec horodatages

#### 4. Recommandations
- Anime suggérés en fonction des tendances
- File d'attente de visionnage personnalisée
- Informations sur les épisodes et le statut
- Panneau d'accès rapide sur la barre latérale droite

#### 5. Support multi-appareils
- Synchronisation automatique
- Fonctionne sur les onglets, les navigateurs et les appareils
- Design réactif
- Interface tactile

### Documentation

Une documentation complète est disponible dans le répertoire `/docs`:

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Conception du système et aperçu des composants (EN/FR)
- **[SETUP.md](./docs/SETUP.md)** - Guide d'installation et de configuration (EN/FR)
- **[FEATURES.md](./docs/FEATURES.md)** - Guide complet des fonctionnalités et de l'utilisateur (EN/FR)
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guide de déploiement en production (EN/FR)

### Structure du projet

```
animeflix/
├── packages/
│   ├── server/                  # Application backend
│   │   ├── src/
│   │   │   └── index.js         # Serveur principal avec Socket.io
│   │   ├── package.json
│   │   └── .env                 # Configuration du serveur
│   │
│   └── client/                  # Application frontend
│       ├── src/
│       │   ├── components/      # Composants React
│       │   │   ├── ChatOverlay.jsx
│       │   │   ├── TrendsTicker.jsx
│       │   │   ├── NotificationBell.jsx
│       │   │   └── RecommendationPanel.jsx
│       │   ├── services/
│       │   │   └── socket.js    # Client Socket.io
│       │   ├── store/
│       │   │   └── index.js     # État Zustand
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── FEATURES.md
│   └── DEPLOYMENT.md
│
├── package.json                  # Package racine
└── README.md                     # Ce fichier
```

### Développement

#### Scripts disponibles

```bash
# Mode développement (exécute le serveur et le client simultanément)
npm run dev

# Serveur uniquement
npm run dev:server

# Client uniquement
npm run dev:client

# Construire les deux packages
npm run build

# Construire le serveur
npm run build:server

# Construire le client
npm run build:client

# Démarrer le serveur de production
npm start

# Exécuter les tests
npm run test
```

#### Apporter des modifications

1. Modifications du serveur:
   - Modifiez les fichiers dans `packages/server/src/`
   - Le serveur redémarre automatiquement avec `--watch`

2. Modifications du client:
   - Modifiez les fichiers dans `packages/client/src/`
   - Hot module replacement actif
   - Les modifications se reflètent immédiatement

3. Ajouter des dépendances:
   ```bash
   cd packages/server
   npm install <nom-du-package>
   ```

#### Événements Socket.io

**Émis par le client:**
- `join-room` - Rejoindre une salle de chat
- `send-comment` - Envoyer un message
- `like-comment` - Aimer un commentaire
- `typing` - Indiquer la saisie
- `stop-typing` - Arrêter l'indicateur de saisie
- `leave-room` - Quitter la salle

**Reçus par le client:**
- `new-comment` - Nouveau message dans la salle
- `user-joined` - L'utilisateur a rejoint la salle
- `user-left` - L'utilisateur a quitté la salle
- `user-typing` - L'utilisateur tape
- `user-stop-typing` - L'utilisateur a arrêté de taper
- `comment-liked` - Le commentaire a été aimé
- `trend-update` - Données de tendance mises à jour
- `notification` - Nouvelle notification reçue

### Tests

#### Tests manuels

1. **Sync multi-onglets:**
   ```bash
   npm run dev
   # Ouvrez http://localhost:5173 dans deux onglets
   # Rejoignez la même salle dans les deux
   # Envoyez un message dans un onglet
   # Vérifiez qu'il apparaît instantanément dans l'autre onglet
   ```

2. **Mises à jour des tendances:**
   - Envoyez plusieurs commentaires
   - Regardez les tendances se mettre à jour en temps réel
   - Vérifiez que le classement change

3. **Notifications:**
   - Cliquez sur "Test Notification"
   - Vérifiez que l'icône de cloche se met à jour
   - Vérifiez la notification du navigateur (si autorisée)

4. **Présence des utilisateurs:**
   - Rejoignez avec plusieurs onglets
   - Regardez le nombre d'utilisateurs actifs changer
   - Quittez et rejoignez pour vérifier les mises à jour

#### Outils de développement du navigateur

- Ouvrez l'onglet Réseau pour voir les événements Socket.io
- Ouvrez la Console pour voir les journaux de connexion
- Utilisez Redux DevTools (si ajouté) pour l'inspection d'état

### Déploiement

#### Déploiement Docker

```bash
# Construire l'image
docker build -t animeflix .

# Exécuter le conteneur
docker run -p 3000:3000 animeflix
```

#### Construction de production

```bash
# Construire les deux packages
npm run build

# Démarrer le serveur de production
PORT=3000 npm start
```

#### Variables d'environnement

Créez `.env` dans `packages/server/`:

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

Pour des instructions de déploiement détaillées, voir [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Support du navigateur

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Conseils de performance

1. Utilisez les outils de développement du navigateur pour surveiller les connexions WebSocket
2. Surveillez l'utilisation de la mémoire avec plusieurs clients connectés
3. Les tendances se mettent à jour efficacement avec la diffusion en temps réel
4. Commentaires stockés en mémoire (envisager une base de données pour la mise à l'échelle)

### Limitations connues

- Commentaires stockés uniquement en mémoire (perdus au redémarrage du serveur)
- Instance de serveur unique (utiliser Redis pour plusieurs instances)
- Pas d'authentification utilisateur (recommandée pour la production)
- Pas de persistance de base de données (peut être ajoutée)

### Améliorations futures

- Persistance de la base de données (MongoDB/PostgreSQL)
- Redis pour la scalabilité
- Authentification et profils utilisateur
- Messagerie privée
- Intégration du streaming vidéo
- Algorithmes de recommandation avancés
- Tableau de bord d'analyse

### Dépannage

**La connexion Socket échoue:**
- Vérifiez que le serveur s'exécute sur le port 3000
- Vérifiez les erreurs dans la console du navigateur
- Assurez-vous que les paramètres CORS sont corrects

**Les messages ne se synchronisent pas:**
- Vérifiez la connexion WebSocket dans l'onglet Réseau
- Vérifiez que vous êtes dans la même salle
- Essayez de rafraîchir la page

**Les notifications ne s'affichent pas:**
- Accordez la permission de notification du navigateur
- Vérifiez les paramètres de notification du navigateur
- Vérifiez que le point de terminaison `/api/notifications` fonctionne

### Contribution

1. Branchez le référentiel
2. Créez une branche de fonctionnalité
3. Apportez vos modifications
4. Soumettez une demande de fusion

### Licence

Licence MIT
