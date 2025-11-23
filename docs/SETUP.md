# Animeflix Setup Guide

## Table of Contents
- [English](#english)
- [Français](#français)

---

## English

### Prerequisites

Before setting up Animeflix, ensure you have:
- Node.js 16+ installed
- npm or yarn package manager
- Git
- Docker (optional, for containerized deployment)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd animeflix
```

#### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd packages/server
npm install

# Install client dependencies
cd ../client
npm install

# Go back to root
cd ../..
```

#### 3. Environment Configuration

Create `.env` files for each package:

**packages/server/.env**
```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**packages/client/.env** (optional, Vite will use defaults)
```
VITE_SOCKET_URL=http://localhost:3000
```

### Running the Application

#### Development Mode

From the project root, run both server and client:

```bash
npm run dev
```

This runs concurrently:
- Server on `http://localhost:3000`
- Client on `http://localhost:5173`

**Or run separately:**

```bash
# Terminal 1: Start server
npm run dev:server

# Terminal 2: Start client
npm run dev:client
```

#### Production Build

```bash
# Build both packages
npm run build

# Build server only
npm run build:server

# Build client only
npm run build:client
```

#### Production Mode

```bash
# After building
npm start
```

The server will run on the configured PORT (default 3000).

### Project Structure

```
animeflix/
├── packages/
│   ├── server/              # Backend application
│   │   ├── src/
│   │   │   └── index.js     # Main server file
│   │   └── package.json
│   ├── client/              # Frontend application
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── services/    # Socket.io integration
│   │   │   ├── store/       # Zustand store
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   └── package.json
├── docs/                     # Documentation
├── package.json             # Root package
└── README.md
```

### Testing Real-time Features

#### Test Multi-Tab Sync

1. Start the application with `npm run dev`
2. Open `http://localhost:5173` in two browser tabs
3. In tab 1: Click "Join Room" for an anime/episode
4. In tab 2: Click "Join Room" for the same anime/episode
5. Send a message in tab 1
6. Observe the message appear instantly in tab 2
7. Verify active user count updates in both tabs

#### Test Notifications

1. Open the application
2. Click "Test Notification" button
3. The notification should appear in the bell dropdown
4. If permission granted, a browser notification should show

#### Test Trends

1. Join a room
2. Send multiple comments
3. Watch the "Trending Now" panel update in real-time
4. Open another tab and verify trends sync

### Common Issues & Solutions

**Port Already in Use:**
```bash
# Change port in .env
PORT=3001
```

**Socket Connection Failed:**
- Verify server is running on `localhost:3000`
- Check FRONTEND_URL and VITE_SOCKET_URL match
- Clear browser cache and hard refresh

**Module Not Found:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## Français

### Prérequis

Avant de configurer Animeflix, assurez-vous d'avoir:
- Node.js 16+ installé
- npm ou yarn gestionnaire de paquets
- Git
- Docker (optionnel, pour le déploiement conteneurisé)

### Installation

#### 1. Cloner le référentiel

```bash
git clone <repository-url>
cd animeflix
```

#### 2. Installer les dépendances

```bash
# Installer les dépendances racine
npm install

# Installer les dépendances du serveur
cd packages/server
npm install

# Installer les dépendances du client
cd ../client
npm install

# Retour à la racine
cd ../..
```

#### 3. Configuration de l'environnement

Créez des fichiers `.env` pour chaque package:

**packages/server/.env**
```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**packages/client/.env** (optionnel, Vite utilisera les valeurs par défaut)
```
VITE_SOCKET_URL=http://localhost:3000
```

### Exécution de l'application

#### Mode développement

À partir de la racine du projet, exécutez le serveur et le client:

```bash
npm run dev
```

Cela s'exécute simultanément:
- Serveur sur `http://localhost:3000`
- Client sur `http://localhost:5173`

**Ou exécuter séparément:**

```bash
# Terminal 1: Démarrer le serveur
npm run dev:server

# Terminal 2: Démarrer le client
npm run dev:client
```

#### Construction de production

```bash
# Construire les deux packages
npm run build

# Construire le serveur uniquement
npm run build:server

# Construire le client uniquement
npm run build:client
```

#### Mode production

```bash
# Après la construction
npm start
```

Le serveur s'exécutera sur le PORT configuré (par défaut 3000).

### Structure du projet

```
animeflix/
├── packages/
│   ├── server/              # Application backend
│   │   ├── src/
│   │   │   └── index.js     # Fichier serveur principal
│   │   └── package.json
│   ├── client/              # Application frontend
│   │   ├── src/
│   │   │   ├── components/  # Composants React
│   │   │   ├── services/    # Intégration Socket.io
│   │   │   ├── store/       # Magasin Zustand
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   └── package.json
├── docs/                     # Documentation
├── package.json             # Package racine
└── README.md
```

### Test des fonctionnalités en temps réel

#### Test de synchronisation multi-onglets

1. Démarrez l'application avec `npm run dev`
2. Ouvrez `http://localhost:5173` dans deux onglets du navigateur
3. Dans l'onglet 1: Cliquez sur "Join Room" pour un anime/épisode
4. Dans l'onglet 2: Cliquez sur "Join Room" pour le même anime/épisode
5. Envoyez un message dans l'onglet 1
6. Observez le message apparaître instantanément dans l'onglet 2
7. Vérifiez que le nombre d'utilisateurs actifs se met à jour dans les deux onglets

#### Test des notifications

1. Ouvrez l'application
2. Cliquez sur le bouton "Test Notification"
3. La notification doit apparaître dans le menu déroulant de la cloche
4. Si la permission est accordée, une notification du navigateur doit s'afficher

#### Test des tendances

1. Rejoignez une salle
2. Envoyez plusieurs commentaires
3. Regardez le panneau "Trending Now" se mettre à jour en temps réel
4. Ouvrez un autre onglet et vérifiez que les tendances se synchronisent

### Problèmes courants et solutions

**Port déjà utilisé:**
```bash
# Changer le port dans .env
PORT=3001
```

**Connexion Socket échouée:**
- Vérifiez que le serveur s'exécute sur `localhost:3000`
- Vérifiez que FRONTEND_URL et VITE_SOCKET_URL correspondent
- Effacez le cache du navigateur et rafraîchissez fortement

**Module non trouvé:**
```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install
```
