# Animeflix Features & User Guide

## Table of Contents
- [English](#english)
- [Français](#français)

---

## English

### Core Features

#### 1. Live Comments (Real-time Chat)

**Description:**
Communicate with other viewers in real-time while watching anime episodes.

**How to Use:**
1. Select an anime and episode from the dropdowns
2. Click "Join Room"
3. Type your comment in the chat input
4. Click "Send" or press Enter
5. Your comment appears instantly for all users in the room

**Features:**
- Synchronized across multiple tabs/browsers
- Typing indicators show when others are typing
- Comment timestamps for context
- Like reactions on comments (future enhancement)

#### 2. Real-time Trend Counter

**Description:**
Track which anime are trending based on live comment activity.

**How to Use:**
1. The "Trending Now" panel on the left shows top 10 trending anime
2. Each comment increments the trend count for that anime
3. Rankings update in real-time
4. Trends are visible to all connected users

**Features:**
- Real-time ranking updates
- Comment-based trend calculation
- Synchronized across all users
- Visual ranking indicators (1st, 2nd, 3rd, etc.)

#### 3. Push Notifications

**Description:**
Receive notifications about new episode releases and other events.

**How to Use:**
1. Click "Test Notification" button to send a test notification
2. Browser notification appears if permissions granted
3. In-app notification appears in the bell dropdown
4. Click on notifications to mark as read

**Features:**
- Browser notification API integration
- In-app notification center with dropdown
- Unread notification badge
- Notification history with timestamps
- Permission request on first load

#### 4. Recommendation Panel

**Description:**
Get personalized anime recommendations and manage your watch queue.

**Recommendations Section:**
- Shows suggested anime based on trends and viewing habits
- Click on recommendations to add to queue
- Each card shows title, description, and rating

**Watch Queue Section:**
- Ordered list of anime to watch
- Episode information for each item
- Status indicators (Next, Soon, Queued)
- Simple queue management interface

**Features:**
- Recommendation scoring system
- Queue ordering and prioritization
- Integration with watch history (future)

#### 5. Active User Presence

**Description:**
See how many people are watching and chatting in the current room.

**How to Use:**
- Active user count displayed in the chat overlay header
- Count updates in real-time when users join/leave
- Indicates viewer engagement

### Getting Started

#### First Time Setup

1. Open application at `http://localhost:5173`
2. You'll receive a unique user ID and random username
3. Select an anime from the dropdown
4. Select an episode from the dropdown
5. Click "Join Room" to enter the chat
6. Start sending messages!

#### Multi-Device Testing

**Setup Two Browsers:**

1. Open the app in Browser A (e.g., Chrome) at `http://localhost:5173`
2. Join a room by selecting anime/episode and clicking "Join Room"
3. Open the app in Browser B (e.g., Firefox) at the same URL
4. Join the same anime/episode in Browser B
5. Send message from Browser A
6. Verify message appears instantly in Browser B
7. Trends should also sync in real-time

**Setup Two Tabs (Same Browser):**

1. Open `http://localhost:5173` in Tab 1
2. Join a room (e.g., Anime 1, Episode 1)
3. Right-click and open link in new tab for Tab 2
4. In Tab 2, join the same room
5. Send messages and watch real-time sync

### UI Components Overview

#### Header
- Application title and logo
- Current user information
- Notification bell with unread count

#### Controls Panel
- Anime selector dropdown
- Episode selector dropdown
- Join/Leave Room button (toggles based on state)
- Test Notification button
- Show/Hide Chat button

#### Main Content Area

**Video Player Area:**
- Placeholder for video content
- Shows current anime and episode
- Only visible when room is joined

**Chat Overlay:**
- Message list with automatic scrolling
- Typing indicators
- Active user count
- Message input form
- Send button

#### Left Sidebar
- Trending Now panel
- Top 10 trending anime
- Real-time ranking with visual indicators

#### Right Sidebar
- Recommendation cards grid
- Watch queue list
- Scrollable panels

### Tips & Tricks

1. **Fast Room Switching:** Use the anime/episode dropdowns to quickly switch rooms
2. **Test Notifications:** Click "Test Notification" multiple times to see queue functionality
3. **Multi-Tab Demo:** Open multiple tabs for the best real-time sync demonstration
4. **Check Notifications:** Look at the bell icon to see unread count
5. **Active Users:** Monitor the active user count in chat to see room participation

---

## Français

### Caractéristiques principales

#### 1. Commentaires en direct (Chat en temps réel)

**Description:**
Communiquez avec d'autres spectateurs en temps réel en regardant des épisodes d'anime.

**Comment utiliser:**
1. Sélectionnez un anime et un épisode dans les listes déroulantes
2. Cliquez sur "Join Room"
3. Tapez votre commentaire dans le champ de saisie du chat
4. Cliquez sur "Send" ou appuyez sur Entrée
5. Votre commentaire apparaît instantanément pour tous les utilisateurs de la salle

**Caractéristiques:**
- Synchronisé sur plusieurs onglets/navigateurs
- Les indicateurs de saisie montrent quand d'autres tapent
- Horodatages de commentaires pour le contexte
- Les réactions "J'aime" sur les commentaires (amélioration future)

#### 2. Compteur de tendances en temps réel

**Description:**
Suivez les anime qui sont en tendance en fonction de l'activité des commentaires en direct.

**Comment utiliser:**
1. Le panneau "Trending Now" à gauche affiche les 10 meilleurs anime en tendance
2. Chaque commentaire augmente le nombre de tendances pour cet anime
3. Les classements se mettent à jour en temps réel
4. Les tendances sont visibles pour tous les utilisateurs connectés

**Caractéristiques:**
- Mises à jour du classement en temps réel
- Calcul des tendances basé sur les commentaires
- Synchronisé sur tous les utilisateurs
- Indicateurs de classement visuels (1er, 2e, 3e, etc.)

#### 3. Notifications push

**Description:**
Recevez des notifications concernant les nouvelles versions d'épisodes et autres événements.

**Comment utiliser:**
1. Cliquez sur le bouton "Test Notification" pour envoyer une notification de test
2. La notification du navigateur apparaît si les permissions sont accordées
3. La notification dans l'application apparaît dans le menu déroulant de la cloche
4. Cliquez sur les notifications pour les marquer comme lues

**Caractéristiques:**
- Intégration de l'API de notification du navigateur
- Centre de notifications in-app avec menu déroulant
- Badge de notification non lue
- Historique de notifications avec horodatages
- Demande de permission au premier chargement

#### 4. Panneau de recommandation

**Description:**
Obtenez des recommandations d'anime personnalisées et gérez votre file d'attente de visionnage.

**Section Recommandations:**
- Affiche les anime suggérés en fonction des tendances et des habitudes de visionnage
- Cliquez sur les recommandations pour ajouter à la file d'attente
- Chaque carte affiche le titre, la description et l'évaluation

**Section File d'attente de visionnage:**
- Liste ordonnée d'anime à regarder
- Informations d'épisode pour chaque élément
- Indicateurs de statut (Suivant, Bientôt, En attente)
- Interface de gestion simple de la file d'attente

**Caractéristiques:**
- Système de notation des recommandations
- Classement et priorisation de la file d'attente
- Intégration avec l'historique de visionnage (futur)

#### 5. Présence des utilisateurs actifs

**Description:**
Voyez combien de personnes regardent et chattent dans la salle actuelle.

**Comment utiliser:**
- Le nombre d'utilisateurs actifs s'affiche dans l'en-tête de la superposition de chat
- Le nombre se met à jour en temps réel lorsque les utilisateurs se connectent/déconnectent
- Indique l'engagement des spectateurs

### Pour commencer

#### Configuration initiale

1. Ouvrez l'application à `http://localhost:5173`
2. Vous recevrez un ID d'utilisateur unique et un nom d'utilisateur aléatoire
3. Sélectionnez un anime dans la liste déroulante
4. Sélectionnez un épisode dans la liste déroulante
5. Cliquez sur "Join Room" pour entrer dans le chat
6. Commencez à envoyer des messages!

#### Test multi-appareils

**Configuration de deux navigateurs:**

1. Ouvrez l'application dans le navigateur A (par exemple, Chrome) à `http://localhost:5173`
2. Rejoignez une salle en sélectionnant anime/épisode et en cliquant sur "Join Room"
3. Ouvrez l'application dans le navigateur B (par exemple, Firefox) à la même URL
4. Rejoignez le même anime/épisode dans le navigateur B
5. Envoyez un message depuis le navigateur A
6. Vérifiez que le message apparaît instantanément dans le navigateur B
7. Les tendances devraient également se synchroniser en temps réel

**Configuration de deux onglets (même navigateur):**

1. Ouvrez `http://localhost:5173` dans l'onglet 1
2. Rejoignez une salle (par exemple, Anime 1, Épisode 1)
3. Cliquez avec le bouton droit et ouvrez le lien dans un nouvel onglet pour l'onglet 2
4. Dans l'onglet 2, rejoignez la même salle
5. Envoyez des messages et regardez la synchronisation en temps réel

### Aperçu des composants de l'interface utilisateur

#### En-tête
- Titre et logo de l'application
- Informations sur l'utilisateur actuel
- Cloche de notification avec nombre non lus

#### Panneau de contrôles
- Liste déroulante du sélecteur d'anime
- Liste déroulante du sélecteur d'épisode
- Bouton Rejoindre/Quitter la salle (bascule selon l'état)
- Bouton de notification de test
- Bouton Afficher/Masquer le chat

#### Zone de contenu principal

**Zone de lecteur vidéo:**
- Espace réservé pour le contenu vidéo
- Affiche l'anime et l'épisode actuels
- Visible uniquement lorsque la salle est rejointe

**Superposition de chat:**
- Liste de messages avec défilement automatique
- Indicateurs de saisie
- Nombre d'utilisateurs actifs
- Formulaire d'entrée de message
- Bouton d'envoi

#### Barre latérale gauche
- Panneau Tendances maintenant
- Top 10 anime en tendance
- Classement en temps réel avec indicateurs visuels

#### Barre latérale droite
- Grille de cartes de recommandation
- Liste de file d'attente de visionnage
- Panneaux scrollables

### Conseils et astuces

1. **Commutation rapide de salle:** Utilisez les listes déroulantes anime/épisode pour basculer rapidement entre les salles
2. **Notifications de test:** Cliquez plusieurs fois sur "Test Notification" pour voir la fonctionnalité de file d'attente
3. **Démo multi-onglets:** Ouvrez plusieurs onglets pour la meilleure démonstration de synchronisation en temps réel
4. **Vérifier les notifications:** Regardez l'icône de cloche pour voir le nombre non lus
5. **Utilisateurs actifs:** Suivez le nombre d'utilisateurs actifs dans le chat pour voir la participation à la salle
