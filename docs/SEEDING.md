# Animeflix Data Seeding Guide

## Table of Contents
- [English](#english)
- [Français](#français)

---

## English

### Overview

This guide explains how to seed sample data into Animeflix for testing and demonstration purposes.

### Initial Data Structure

When the server starts, it initializes empty in-memory storage:
- `comments`: Map to store comments by room
- `trends`: Map to store trend data
- `activeUsers`: Map to track users in rooms
- `notifications`: Map to store user notifications

### Seeding Sample Data

#### Using the UI

The easiest way to seed data is through the web interface:

1. Start the application: `npm run dev`
2. Open `http://localhost:5173`
3. Follow these steps:

**Creating Sample Comments:**

```
1. Select "Anime 1" from the anime dropdown
2. Select "Episode 1" from the episode dropdown
3. Click "Join Room"
4. Type messages in the chat input:
   - "This anime is amazing!"
   - "Great animation quality"
   - "Can't wait for the next episode"
5. Send each message by clicking Send
```

**Creating Trends:**

Comments automatically create trends. To build trends:

1. Open multiple tabs/windows with the same anime/episode
2. From each tab, send several comments
3. Watch the "Trending Now" panel update in real-time
4. Each comment increments the trend counter

**Creating Notifications:**

1. Click "Test Notification" button
2. Click it multiple times to create multiple notifications
3. Watch the notification bell badge increase
4. Click the bell to see notification history

#### Programmatic Seeding (Optional)

To add direct seeding via API or script:

Create `seed-data.js`:

```javascript
import http from 'http';

const seedData = async () => {
  const animeIds = ['1', '2', '3'];
  const episodeIds = ['1', '2', '3'];
  const comments = [
    'Amazing episode!',
    'Best anime ever',
    'Great character development',
    'Can\\'t wait for next week',
    'This is so good',
    'The animation quality is top-notch'
  ];

  // Emit comments via Socket.io
  for (const animeId of animeIds) {
    for (const episodeId of episodeIds) {
      for (let i = 0; i < 3; i++) {
        const comment = comments[Math.floor(Math.random() * comments.length)];
        console.log(`Seeding comment for Anime ${animeId}, Episode ${episodeId}: ${comment}`);
      }
    }
  }
};

seedData().catch(console.error);
```

### Sample Data Specifications

#### Anime

```javascript
{
  id: '1',
  title: 'Attack on Titan',
  description: 'A dark fantasy anime about humanity fighting giant creatures',
  episodes: 25,
  status: 'Completed'
}
```

#### Episodes

```javascript
{
  id: '1',
  animeId: '1',
  title: 'Episode 1: To You, 2000 Years in the Future',
  episodeNumber: 1,
  releaseDate: '2013-04-07',
  duration: 1440
}
```

#### Comments

```javascript
{
  id: 'uuid-v4',
  userId: 'user-1',
  userName: 'AnimeWatcher',
  text: 'This is the best opening I\'ve ever heard!',
  timestamp: '2024-01-01T12:00:00Z',
  likes: 5
}
```

#### Trends

```javascript
{
  id: '1',
  name: 'Attack on Titan',
  count: 150,
  mentions: 75
}
```

#### Notifications

```javascript
{
  id: 'uuid-v4',
  userId: 'user-1',
  title: 'New Episode Released!',
  message: 'Episode 2 of Attack on Titan is now available',
  animeId: '1',
  episodeId: '2',
  timestamp: '2024-01-01T12:00:00Z',
  read: false,
  type: 'episode-release'
}
```

### Testing Different Scenarios

#### Scenario 1: Real-time Sync

1. Open two browser tabs at `http://localhost:5173`
2. In Tab A: Select Anime 1, Episode 1, click "Join Room"
3. In Tab B: Select Anime 1, Episode 1, click "Join Room"
4. In Tab A: Send "Hello from Tab A"
5. Verify in Tab B: Message appears instantly
6. In Tab B: Send "Hello from Tab B"
7. Verify in Tab A: Message appears instantly
8. Check active user count is 2 in both tabs

#### Scenario 2: Trend Building

1. Open multiple tabs (3+) all connected to same room
2. Each tab sends 2-3 comments
3. Observe "Trending Now" panel showing Anime 1 with high count
4. Check count = number of total comments across all tabs

#### Scenario 3: Notifications

1. Click "Test Notification" once
2. Verify notification appears in bell dropdown
3. Click again multiple times (5+)
4. Badge shows correct count (5+)
5. Click notification to mark as read
6. Verify styling changes

#### Scenario 4: Room Switching

1. Join Anime 1, Episode 1
2. Send a comment
3. Switch to Anime 1, Episode 2
4. Observe comment doesn't appear
5. Switch to Anime 2, Episode 1
6. Send different comment
7. Verify trends are specific to anime
8. Switch back to Anime 1, Episode 1
9. Verify original comment still there

### Sample Test Script

```bash
#!/bin/bash

echo "=== Animeflix Seeding Demo ==="
echo ""
echo "1. Starting server and client..."
npm run dev &
sleep 5

echo "2. Opening browser..."
open http://localhost:5173

echo "3. Manual seeding instructions:"
echo "   - Open two tabs at http://localhost:5173"
echo "   - In both tabs, select Anime 1, Episode 1"
echo "   - Click 'Join Room' in both"
echo "   - Send messages from each tab"
echo "   - Test 'Test Notification' button"
echo "   - Observe real-time sync"
echo ""
echo "Server and client running. Stop with Ctrl+C"
```

### Verification Checklist

- [ ] Comments appear in real-time across tabs
- [ ] Trends update with each new comment
- [ ] Active user count shows correct numbers
- [ ] Notifications appear in bell dropdown
- [ ] Browser notifications work (if permission granted)
- [ ] Room switching keeps data isolated
- [ ] Typing indicators appear
- [ ] Multiple rooms have independent data

---

## Français

### Aperçu

Ce guide explique comment remplir des données d'exemple dans Animeflix à des fins de test et de démonstration.

### Structure de données initiale

Lorsque le serveur démarre, il initialise un stockage en mémoire vide:
- `comments`: Carte pour stocker les commentaires par salle
- `trends`: Carte pour stocker les données de tendances
- `activeUsers`: Carte pour suivre les utilisateurs dans les salles
- `notifications`: Carte pour stocker les notifications utilisateur

### Remplissage des données d'exemple

#### Utilisation de l'interface utilisateur

Le moyen le plus simple de remplir les données est via l'interface Web:

1. Démarrez l'application: `npm run dev`
2. Ouvrez `http://localhost:5173`
3. Suivez ces étapes:

**Création de commentaires d'exemple:**

```
1. Sélectionnez "Anime 1" dans la liste déroulante anime
2. Sélectionnez "Épisode 1" dans la liste déroulante épisode
3. Cliquez sur "Join Room"
4. Tapez des messages dans le champ de saisie du chat:
   - "Cet anime est incroyable!"
   - "Qualité d'animation exceptionnelle"
   - "Hâte de voir le prochain épisode"
5. Envoyez chaque message en cliquant sur Envoyer
```

**Création de tendances:**

Les commentaires créent automatiquement des tendances. Pour construire des tendances:

1. Ouvrez plusieurs onglets/fenêtres avec le même anime/épisode
2. De chaque onglet, envoyez plusieurs commentaires
3. Regardez le panneau "Trending Now" se mettre à jour en temps réel
4. Chaque commentaire augmente le compteur de tendances

**Création de notifications:**

1. Cliquez sur le bouton "Test Notification"
2. Cliquez plusieurs fois pour créer plusieurs notifications
3. Regardez le badge de la cloche de notification augmenter
4. Cliquez sur la cloche pour voir l'historique des notifications

#### Remplissage par programmation (Optionnel)

Pour ajouter un remplissage direct via API ou script:

Créez `seed-data.js`:

```javascript
import http from 'http';

const seedData = async () => {
  const animeIds = ['1', '2', '3'];
  const episodeIds = ['1', '2', '3'];
  const comments = [
    'Épisode incroyable!',
    'Meilleur anime jamais',
    'Excellent développement des personnages',
    'Hâte de la semaine prochaine',
    'C\\'est tellement bon',
    'La qualité d\\'animation est exceptionnelle'
  ];

  // Émettre des commentaires via Socket.io
  for (const animeId of animeIds) {
    for (const episodeId of episodeIds) {
      for (let i = 0; i < 3; i++) {
        const comment = comments[Math.floor(Math.random() * comments.length)];
        console.log(`Remplissage du commentaire pour Anime ${animeId}, Épisode ${episodeId}: ${comment}`);
      }
    }
  }
};

seedData().catch(console.error);
```

### Spécifications des données d'exemple

#### Anime

```javascript
{
  id: '1',
  title: 'Attaque des Titans',
  description: 'Un anime de dark fantasy sur l'humanité combattant des créatures géantes',
  episodes: 25,
  status: 'Terminé'
}
```

#### Épisodes

```javascript
{
  id: '1',
  animeId: '1',
  title: 'Épisode 1: À vous, il y a 2000 ans',
  episodeNumber: 1,
  releaseDate: '2013-04-07',
  duration: 1440
}
```

#### Commentaires

```javascript
{
  id: 'uuid-v4',
  userId: 'user-1',
  userName: 'AnimeWatcher',
  text: 'C\\'est le meilleur générique que j\\'ai jamais entendu!',
  timestamp: '2024-01-01T12:00:00Z',
  likes: 5
}
```

#### Tendances

```javascript
{
  id: '1',
  name: 'Attaque des Titans',
  count: 150,
  mentions: 75
}
```

#### Notifications

```javascript
{
  id: 'uuid-v4',
  userId: 'user-1',
  title: 'Nouvel épisode publié!',
  message: 'L\\'épisode 2 d\\'Attaque des Titans est maintenant disponible',
  animeId: '1',
  episodeId: '2',
  timestamp: '2024-01-01T12:00:00Z',
  read: false,
  type: 'episode-release'
}
```

### Test de différents scénarios

#### Scénario 1: Sync en temps réel

1. Ouvrez deux onglets de navigateur à `http://localhost:5173`
2. Dans l'onglet A: Sélectionnez Anime 1, Épisode 1, cliquez sur "Join Room"
3. Dans l'onglet B: Sélectionnez Anime 1, Épisode 1, cliquez sur "Join Room"
4. Dans l'onglet A: Envoyez "Bonjour depuis l'onglet A"
5. Vérifiez dans l'onglet B: Le message apparaît instantanément
6. Dans l'onglet B: Envoyez "Bonjour depuis l'onglet B"
7. Vérifiez dans l'onglet A: Le message apparaît instantanément
8. Vérifiez que le nombre d'utilisateurs actifs est 2 dans les deux onglets

#### Scénario 2: Construction de tendances

1. Ouvrez plusieurs onglets (3+) tous connectés à la même salle
2. Chaque onglet envoie 2-3 commentaires
3. Observez le panneau "Trending Now" montrant Anime 1 avec un nombre élevé
4. Vérifiez que le nombre = nombre total de commentaires sur tous les onglets

#### Scénario 3: Notifications

1. Cliquez sur "Test Notification" une fois
2. Vérifiez que la notification apparaît dans le menu déroulant de la cloche
3. Cliquez plusieurs fois (5+)
4. Le badge affiche le nombre correct (5+)
5. Cliquez sur la notification pour la marquer comme lue
6. Vérifiez que le style change

#### Scénario 4: Changement de salle

1. Rejoignez Anime 1, Épisode 1
2. Envoyez un commentaire
3. Basculez vers Anime 1, Épisode 2
4. Observez que le commentaire n'apparaît pas
5. Basculez vers Anime 2, Épisode 1
6. Envoyez un commentaire différent
7. Vérifiez que les tendances sont spécifiques à l'anime
8. Revenez à Anime 1, Épisode 1
9. Vérifiez que le commentaire original est toujours là

### Script de test d'exemple

```bash
#!/bin/bash

echo "=== Démo de remplissage Animeflix ==="
echo ""
echo "1. Démarrage du serveur et du client..."
npm run dev &
sleep 5

echo "2. Ouverture du navigateur..."
open http://localhost:5173

echo "3. Instructions de remplissage manuel:"
echo "   - Ouvrez deux onglets à http://localhost:5173"
echo "   - Dans les deux onglets, sélectionnez Anime 1, Épisode 1"
echo "   - Cliquez sur 'Join Room' dans les deux"
echo "   - Envoyez des messages de chaque onglet"
echo "   - Testez le bouton 'Test Notification'"
echo "   - Observez la synchronisation en temps réel"
echo ""
echo "Serveur et client en cours d'exécution. Arrêtez avec Ctrl+C"
```

### Liste de vérification de vérification

- [ ] Les commentaires apparaissent en temps réel sur les onglets
- [ ] Les tendances se mettent à jour avec chaque nouveau commentaire
- [ ] Le nombre d'utilisateurs actifs affiche les bonnes chiffres
- [ ] Les notifications apparaissent dans le menu déroulant de la cloche
- [ ] Les notifications du navigateur fonctionnent (si permission accordée)
- [ ] Le changement de salle garde les données isolées
- [ ] Les indicateurs de saisie apparaissent
- [ ] Plusieurs salles ont des données indépendantes
