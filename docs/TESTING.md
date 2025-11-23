# Animeflix Testing Guide

## Table of Contents
- [English](#english)
- [Français](#français)

---

## English

### Overview

This guide provides comprehensive instructions for testing Animeflix's real-time features, ensuring all components work correctly.

### Pre-Test Checklist

- [ ] Node.js 16+ installed
- [ ] All dependencies installed: `npm install && cd packages/server && npm install && cd ../client && npm install`
- [ ] Two browser windows or tabs available
- [ ] Browser console accessible (F12)
- [ ] Network tab available in DevTools

### Test Environment Setup

```bash
# Terminal 1: Start development server
cd /home/engine/project
npm run dev

# Wait for messages:
# - "Server running on port 3000"
# - "Socket.io server ready"
# - "Local: http://localhost:5173"

# In Browser: Open http://localhost:5173
```

### Core Feature Tests

#### Test 1: Live Comments - Single Tab

**Objective:** Verify comment sending and display in a single tab

**Steps:**
1. Open `http://localhost:5173` in one tab
2. Select "Anime 1" from dropdown
3. Select "Episode 1" from dropdown
4. Click "Join Room"
5. In chat input, type: "Test message 1"
6. Click "Send"
7. Verify message appears in chat with:
   - Your username
   - Message text
   - Timestamp

**Expected Result:** ✓ Message appears instantly

**Failure Troubleshooting:**
- Check browser console for errors
- Verify server is running on port 3000
- Check Network tab for `socket.io` connection

#### Test 2: Live Comments - Multi-Tab Sync

**Objective:** Verify comments sync in real-time across tabs

**Steps:**
1. Open `http://localhost:5173` in Tab A
2. Select Anime 1, Episode 1, click "Join Room"
3. Open `http://localhost:5173` in Tab B
4. Select Anime 1, Episode 1, click "Join Room"
5. In Tab A, send: "Hello from Tab A"
6. Check Tab B - message should appear instantly
7. In Tab B, send: "Hello from Tab B"
8. Check Tab A - message should appear instantly

**Expected Result:** ✓ Messages sync in both directions within 1 second

**Failure Troubleshooting:**
- Verify both tabs show active user count as 2
- Check WebSocket in Network tab (should be connected)
- Reload both tabs and rejoin room

#### Test 3: Active User Presence

**Objective:** Verify user count updates correctly

**Steps:**
1. Set up Tab A and Tab B as in Test 2
2. Note active user count in chat header (should be 2)
3. Open Tab C, select same anime/episode, join room
4. Verify count updates to 3 in all three tabs
5. Close Tab A
6. Verify count updates to 2 in remaining tabs

**Expected Result:** ✓ Count updates within 1 second

**Failure Troubleshooting:**
- Check server logs for join/leave events
- Verify rooms are named correctly: `anime:{id}:episode:{id}`

#### Test 4: Real-time Trends

**Objective:** Verify trend counter updates

**Steps:**
1. Open two tabs with Anime 1, Episode 1 joined in both
2. Check "Trending Now" panel - should show "Anime 1"
3. From Tab A, send comment: "Great anime"
4. Trend count should increment from 0 to 1
5. From Tab B, send comment: "Love this show"
6. Trend count should increment to 2
7. Continue sending comments and verify count keeps increasing

**Expected Result:** ✓ Trend counter increments with each comment

**Failure Troubleshooting:**
- Check that trend updates are emitted: look for `trend-update` events in Network tab
- Verify count is specific to anime ID

#### Test 5: Typing Indicators

**Objective:** Verify typing indicator functionality

**Steps:**
1. Set up Tab A and Tab B with same room
2. In Tab A, start typing in the chat input
3. Watch Tab B - should see "User_X is typing..." message
4. Stop typing in Tab A
5. Watch Tab B - message should disappear within 2 seconds

**Expected Result:** ✓ Typing indicator appears and disappears

**Failure Troubleshooting:**
- Check that `typing` and `stop-typing` events are emitted
- Typing indicator should clear after 2 seconds of inactivity

#### Test 6: Push Notifications

**Objective:** Verify notification system

**Steps:**
1. Open application in one tab
2. Click "Test Notification" button
3. Verify notification appears in bell dropdown
4. Check notification details:
   - Title visible
   - Message visible
   - Timestamp present
5. Click notification to mark as read
6. Send 5 notifications
7. Verify badge shows correct count

**Expected Result:** ✓ Notifications appear and badge counts correctly

**Failure Troubleshooting:**
- Check `/api/notifications` endpoint is working
- Verify notification store is updating
- Browser notification may require permission grant

#### Test 7: Browser Notifications (Optional)

**Objective:** Verify browser-native notifications

**Steps:**
1. If not already permitted, browser will ask for notification permission
2. Grant permission
3. Click "Test Notification"
4. Check if native browser notification appears

**Expected Result:** ✓ Browser notification shows

**Failure Troubleshooting:**
- Some browsers have notifications disabled
- Check browser notification settings

#### Test 8: Room Isolation

**Objective:** Verify rooms are completely isolated

**Steps:**
1. Open two tabs: Tab A and Tab B
2. Tab A: Anime 1, Episode 1
3. Tab B: Anime 1, Episode 2
4. From Tab A: Send message "Episode 1"
5. Verify message does NOT appear in Tab B
6. From Tab B: Send message "Episode 2"
7. Verify message does NOT appear in Tab A

**Expected Result:** ✓ Comments completely isolated by room

**Failure Troubleshooting:**
- Verify room names include both animeId and episodeId
- Check server logs for separate room creation

#### Test 9: Recommendation Panel

**Objective:** Verify recommendation UI displays

**Steps:**
1. Open application
2. Check right sidebar:
   - "Recommended For You" section visible
   - 3+ recommendation cards displayed
   - Each card shows title, description, rating
3. Check "Watch Queue" section:
   - List of queued items visible
   - Each item shows episode info
4. Verify both sections are scrollable if needed

**Expected Result:** ✓ Both sections display correctly

**Failure Troubleshooting:**
- If not visible, check CSS is loaded
- Verify component is rendered in App.jsx

#### Test 10: UI Responsiveness

**Objective:** Verify responsive design

**Steps:**
1. Open application at normal resolution
2. All components visible and properly laid out
3. Resize browser window to 75% width
4. Controls should reflow appropriately
5. Resize to mobile width (375px)
6. Interface should adapt (may hide sidebars)

**Expected Result:** ✓ Layout adapts to different screen sizes

**Failure Troubleshooting:**
- Check media queries in CSS files
- Verify Flexbox/Grid layout properties

### Browser DevTools Testing

#### Network Tab Verification

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Should see `socket.io` connection
5. Join a room and send a message
6. Should see corresponding socket events

#### Console Verification

1. Open Console tab
2. Should see: "Socket connected"
3. On socket disconnect: "Socket disconnected"
4. No red error messages (warnings are OK)

### Performance Testing

#### Test: Multiple Users

**Setup:** 10+ browser tabs connected to same room

**Steps:**
1. Open 10 tabs all joined to Anime 1, Episode 1
2. Send message from each tab
3. Monitor:
   - Response time (should be < 500ms)
   - Memory usage (should not spike significantly)
   - No lag in UI updates

**Expected Result:** ✓ System handles multiple concurrent users

#### Test: Message Volume

**Steps:**
1. Rapidly send 20+ messages from one tab
2. Check from another tab that all messages arrive
3. No messages lost
4. Order preserved

**Expected Result:** ✓ All messages delivered in order

### Acceptance Criteria Verification

**Criterion 1: Two Browser Sessions Show Synchronized Comments**

- [ ] Setup: Two tabs with same anime/episode
- [ ] Action: Send message from Tab 1
- [ ] Verification: Message appears in Tab 2 within 1 second
- [ ] Result: ✓ PASS

**Criterion 2: Trend Metrics Sync**

- [ ] Setup: Two tabs observing trends
- [ ] Action: Send comment from Tab 1
- [ ] Verification: Trend count updates in Tab 2
- [ ] Result: ✓ PASS

**Criterion 3: Notifications Fire on Episode Simulation**

- [ ] Setup: Application open
- [ ] Action: Click "Test Notification"
- [ ] Verification: 
  - [ ] Notification appears in bell
  - [ ] Badge updates
  - [ ] Browser notification optional
- [ ] Result: ✓ PASS

**Criterion 4: Documentation Available**

- [ ] Verify `/docs` directory exists
- [ ] Check files present:
  - [ ] ARCHITECTURE.md (EN/FR)
  - [ ] SETUP.md (EN/FR)
  - [ ] FEATURES.md (EN/FR)
  - [ ] DEPLOYMENT.md (EN/FR)
  - [ ] SEEDING.md (EN/FR)
- [ ] README.md contains links to docs
- [ ] Result: ✓ PASS

### Regression Testing Checklist

After each code change:

- [ ] Comments still sync
- [ ] Trends still update
- [ ] Notifications still work
- [ ] Active users count correct
- [ ] No console errors
- [ ] Responsive design intact

---

## Français

### Aperçu

Ce guide fournit des instructions complètes pour tester les fonctionnalités en temps réel d'Animeflix, en veillant à ce que tous les composants fonctionnent correctement.

### Liste de contrôle pré-test

- [ ] Node.js 16+ installé
- [ ] Toutes les dépendances installées: `npm install && cd packages/server && npm install && cd ../client && npm install`
- [ ] Deux fenêtres ou onglets de navigateur disponibles
- [ ] Console de navigateur accessible (F12)
- [ ] Onglet Réseau disponible dans DevTools

### Configuration de l'environnement de test

```bash
# Terminal 1: Démarrer le serveur de développement
cd /home/engine/project
npm run dev

# Attendre les messages:
# - "Server running on port 3000"
# - "Socket.io server ready"
# - "Local: http://localhost:5173"

# Dans le navigateur: Ouvrez http://localhost:5173
```

### Tests des caractéristiques principales

#### Test 1: Commentaires en direct - Onglet unique

**Objectif:** Vérifier l'envoi et l'affichage des commentaires dans un seul onglet

**Étapes:**
1. Ouvrez `http://localhost:5173` dans un onglet
2. Sélectionnez "Anime 1" dans la liste déroulante
3. Sélectionnez "Épisode 1" dans la liste déroulante
4. Cliquez sur "Join Room"
5. Dans le champ de saisie du chat, tapez: "Message de test 1"
6. Cliquez sur "Envoyer"
7. Vérifiez que le message apparaît dans le chat avec:
   - Votre nom d'utilisateur
   - Texte du message
   - Horodatage

**Résultat attendu:** ✓ Le message apparaît instantanément

**Dépannage des défaillances:**
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que le serveur s'exécute sur le port 3000
- Vérifiez l'onglet Réseau pour la connexion `socket.io`

#### Test 2: Commentaires en direct - Synchronisation multi-onglets

**Objectif:** Vérifier que les commentaires se synchronisent en temps réel entre les onglets

**Étapes:**
1. Ouvrez `http://localhost:5173` dans l'onglet A
2. Sélectionnez Anime 1, Épisode 1, cliquez sur "Join Room"
3. Ouvrez `http://localhost:5173` dans l'onglet B
4. Sélectionnez Anime 1, Épisode 1, cliquez sur "Join Room"
5. Dans l'onglet A, envoyez: "Bonjour depuis l'onglet A"
6. Vérifiez l'onglet B - le message doit apparaître instantanément
7. Dans l'onglet B, envoyez: "Bonjour depuis l'onglet B"
8. Vérifiez l'onglet A - le message doit apparaître instantanément

**Résultat attendu:** ✓ Les messages se synchronisent dans les deux sens en moins d'une seconde

**Dépannage des défaillances:**
- Vérifiez que les deux onglets affichent le nombre d'utilisateurs actifs comme 2
- Vérifiez WebSocket dans l'onglet Réseau (doit être connecté)
- Rechargez les deux onglets et rejoignez la salle

#### Test 3: Présence des utilisateurs actifs

**Objectif:** Vérifier que le nombre d'utilisateurs se met à jour correctement

**Étapes:**
1. Configurez l'onglet A et l'onglet B comme dans le test 2
2. Notez le nombre d'utilisateurs actifs dans l'en-tête du chat (doit être 2)
3. Ouvrez l'onglet C, sélectionnez le même anime/épisode, rejoignez la salle
4. Vérifiez que le nombre se met à jour à 3 dans les trois onglets
5. Fermez l'onglet A
6. Vérifiez que le nombre se met à jour à 2 dans les onglets restants

**Résultat attendu:** ✓ Le nombre se met à jour dans la 1 seconde

**Dépannage des défaillances:**
- Vérifiez les journaux du serveur pour les événements de jointure/départ
- Vérifiez que les salles sont nommées correctement: `anime:{id}:episode:{id}`

#### Test 4: Tendances en temps réel

**Objectif:** Vérifier que le compteur de tendances se met à jour

**Étapes:**
1. Ouvrez deux onglets avec Anime 1, Épisode 1 rejoint dans les deux
2. Vérifiez le panneau "Trending Now" - doit afficher "Anime 1"
3. De l'onglet A, envoyez un commentaire: "Super anime"
4. Le nombre de tendances doit augmenter de 0 à 1
5. De l'onglet B, envoyez un commentaire: "J'adore ce spectacle"
6. Le nombre de tendances doit augmenter à 2
7. Continuez à envoyer des commentaires et vérifiez que le compte continue d'augmenter

**Résultat attendu:** ✓ Le compteur de tendances augmente avec chaque commentaire

**Dépannage des défaillances:**
- Vérifiez que les mises à jour de tendances sont émises: recherchez les événements `trend-update` dans l'onglet Réseau
- Vérifiez que le nombre est spécifique à l'ID anime

#### Test 5: Indicateurs de saisie

**Objectif:** Vérifier la fonctionnalité des indicateurs de saisie

**Étapes:**
1. Configurez l'onglet A et l'onglet B avec la même salle
2. Dans l'onglet A, commencez à taper dans le champ de saisie du chat
3. Regardez l'onglet B - vous devez voir le message "User_X tape..."
4. Arrêtez de taper dans l'onglet A
5. Regardez l'onglet B - le message doit disparaître dans 2 secondes

**Résultat attendu:** ✓ L'indicateur de saisie apparaît et disparaît

**Dépannage des défaillances:**
- Vérifiez que les événements `typing` et `stop-typing` sont émis
- L'indicateur de saisie doit s'effacer après 2 secondes d'inactivité

#### Test 6: Notifications push

**Objectif:** Vérifier le système de notification

**Étapes:**
1. Ouvrez l'application dans un onglet
2. Cliquez sur le bouton "Test Notification"
3. Vérifiez que la notification apparaît dans le menu déroulant de la cloche
4. Vérifiez les détails de la notification:
   - Titre visible
   - Message visible
   - Horodatage présent
5. Cliquez sur la notification pour la marquer comme lue
6. Envoyez 5 notifications
7. Vérifiez que le badge affiche le nombre correct

**Résultat attendu:** ✓ Les notifications apparaissent et le nombre de badges est correct

**Dépannage des défaillances:**
- Vérifiez que le point de terminaison `/api/notifications` fonctionne
- Vérifiez que le magasin de notifications se met à jour
- La notification du navigateur peut nécessiter une autorisation

#### Test 7: Notifications du navigateur (Optionnel)

**Objectif:** Vérifier les notifications natives du navigateur

**Étapes:**
1. Si ce n'est pas déjà autorisé, le navigateur demandera une autorisation de notification
2. Accorder la permission
3. Cliquez sur "Test Notification"
4. Vérifiez si la notification native du navigateur apparaît

**Résultat attendu:** ✓ La notification du navigateur s'affiche

**Dépannage des défaillances:**
- Certains navigateurs ont les notifications désactivées
- Vérifiez les paramètres de notification du navigateur

#### Test 8: Isolement des salles

**Objectif:** Vérifier que les salles sont complètement isolées

**Étapes:**
1. Ouvrez deux onglets: Onglet A et Onglet B
2. Onglet A: Anime 1, Épisode 1
3. Onglet B: Anime 1, Épisode 2
4. De l'onglet A: Envoyez le message "Épisode 1"
5. Vérifiez que le message n'apparaît PAS dans l'onglet B
6. De l'onglet B: Envoyez le message "Épisode 2"
7. Vérifiez que le message n'apparaît PAS dans l'onglet A

**Résultat attendu:** ✓ Les commentaires complètement isolés par salle

**Dépannage des défaillances:**
- Vérifiez que les noms de salle incluent à la fois animeId et episodeId
- Vérifiez les journaux du serveur pour la création de salle séparée

#### Test 9: Panneau de recommandation

**Objectif:** Vérifier que l'interface utilisateur de recommandation s'affiche

**Étapes:**
1. Ouvrez l'application
2. Vérifiez la barre latérale droite:
   - Section "Recommandations pour vous" visible
   - 3+ cartes de recommandation affichées
   - Chaque carte affiche le titre, la description, l'évaluation
3. Vérifiez la section "File d'attente de visionnage":
   - Liste des éléments en file d'attente visible
   - Chaque élément montre les informations d'épisode
4. Vérifiez que les deux sections sont scrollables si nécessaire

**Résultat attendu:** ✓ Les deux sections s'affichent correctement

**Dépannage des défaillances:**
- Si non visible, vérifiez que CSS est chargé
- Vérifiez que le composant est rendu dans App.jsx

#### Test 10: Réactivité de l'interface utilisateur

**Objectif:** Vérifier la conception réactive

**Étapes:**
1. Ouvrez l'application à la résolution normale
2. Tous les composants visibles et correctement mis en page
3. Redimensionnez la fenêtre du navigateur à 75% de largeur
4. Les contrôles doivent refouler correctement
5. Redimensionnez à la largeur mobile (375px)
6. L'interface doit s'adapter (peut masquer les barres latérales)

**Résultat attendu:** ✓ La disposition s'adapte à différentes tailles d'écran

**Dépannage des défaillances:**
- Vérifiez les requêtes multimédias dans les fichiers CSS
- Vérifiez les propriétés de mise en page Flexbox/Grid

### Tests DevTools du navigateur

#### Vérification de l'onglet Réseau

1. Ouvrez DevTools (F12)
2. Allez à l'onglet Réseau
3. Filtrer par "WS" (WebSocket)
4. Doit afficher la connexion `socket.io`
5. Rejoignez une salle et envoyez un message
6. Doit afficher les événements de socket correspondants

#### Vérification de la console

1. Ouvrez l'onglet Console
2. Doit afficher: "Socket connecté"
3. Sur la déconnexion du socket: "Socket déconnecté"
4. Pas de messages d'erreur rouges (les avertissements sont OK)

### Tests de performance

#### Test: Utilisateurs multiples

**Configuration:** 10+ onglets de navigateur connectés à la même salle

**Étapes:**
1. Ouvrez 10 onglets tous rejoints à Anime 1, Épisode 1
2. Envoyez un message de chaque onglet
3. Surveillez:
   - Temps de réponse (devrait être < 500 ms)
   - Utilisation de la mémoire (ne devrait pas augmenter significativement)
   - Aucun décalage dans les mises à jour de l'interface utilisateur

**Résultat attendu:** ✓ Le système gère plusieurs utilisateurs simultanés

#### Test: Volume de message

**Étapes:**
1. Envoyez rapidement 20+ messages depuis un onglet
2. Vérifiez depuis un autre onglet que tous les messages arrivent
3. Aucun message perdu
4. Commande conservée

**Résultat attendu:** ✓ Tous les messages livrés dans l'ordre
