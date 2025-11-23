import { useEffect, useState } from 'react';
import { useAppStore } from './store';
import { connectSocket, joinRoom, leaveRoom, sendNotification } from './services/socket';
import { ChatOverlay } from './components/ChatOverlay';
import { TrendsTicker } from './components/TrendsTicker';
import { NotificationBell } from './components/NotificationBell';
import { RecommendationPanel } from './components/RecommendationPanel';
import './App.css';

function App() {
  const { user, setShowChatOverlay, showChatOverlay } = useAppStore();
  const [currentAnime, setCurrentAnime] = useState('1');
  const [currentEpisode, setCurrentEpisode] = useState('1');
  const [isJoined, setIsJoined] = useState(false);

  // Sample recommendations and queue data
  const recommendations = [
    { id: '1', title: 'Anime A', description: 'Amazing series', image: '🎬', score: '9.2' },
    { id: '2', title: 'Anime B', description: 'Great show', image: '🎥', score: '8.8' },
    { id: '3', title: 'Anime C', description: 'Must watch', image: '📽️', score: '9.0' },
  ];

  const watchQueue = [
    { id: '1', title: 'Anime X', episode: 'Episode 3', status: 'Next' },
    { id: '2', title: 'Anime Y', episode: 'Episode 12', status: 'Soon' },
    { id: '3', title: 'Anime Z', episode: 'Episode 5', status: 'Queued' },
  ];

  useEffect(() => {
    // Connect to socket on mount
    connectSocket();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleJoinRoom = () => {
    if (!isJoined) {
      joinRoom({
        animeId: currentAnime,
        episodeId: currentEpisode,
        userId: user.id,
        userName: user.name
      });
      setIsJoined(true);
    }
  };

  const handleLeaveRoom = () => {
    if (isJoined) {
      leaveRoom({
        animeId: currentAnime,
        episodeId: currentEpisode,
        userId: user.id,
        userName: user.name
      });
      setIsJoined(false);
    }
  };

  const handleSendTestNotification = () => {
    sendNotification({
      userId: user.id,
      title: 'New Episode Released!',
      message: `New episode available for Anime ${currentAnime}`,
      animeId: currentAnime,
      episodeId: currentEpisode
    });
  };

  const handleChangeAnime = (e) => {
    const newAnime = e.target.value;
    handleLeaveRoom();
    setCurrentAnime(newAnime);
  };

  const handleChangeEpisode = (e) => {
    const newEpisode = e.target.value;
    handleLeaveRoom();
    setCurrentEpisode(newEpisode);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🎬 Animeflix</h1>
        </div>
        <div className="header-center">
          <span className="user-info">👤 {user.name}</span>
        </div>
        <div className="header-right">
          <NotificationBell />
        </div>
      </header>

      <main className="app-main">
        <div className="controls">
          <div className="control-group">
            <label>Anime:</label>
            <select value={currentAnime} onChange={handleChangeAnime}>
              <option value="1">Anime 1</option>
              <option value="2">Anime 2</option>
              <option value="3">Anime 3</option>
            </select>
          </div>
          <div className="control-group">
            <label>Episode:</label>
            <select value={currentEpisode} onChange={handleChangeEpisode}>
              <option value="1">Episode 1</option>
              <option value="2">Episode 2</option>
              <option value="3">Episode 3</option>
            </select>
          </div>
          <div className="button-group">
            {!isJoined ? (
              <button className="btn btn-primary" onClick={handleJoinRoom}>
                Join Room
              </button>
            ) : (
              <button className="btn btn-danger" onClick={handleLeaveRoom}>
                Leave Room
              </button>
            )}
            <button className="btn btn-secondary" onClick={handleSendTestNotification}>
              📬 Test Notification
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowChatOverlay(!showChatOverlay)}
            >
              💬 {showChatOverlay ? 'Hide' : 'Show'} Chat
            </button>
          </div>
        </div>

        <div className="content-layout">
          <div className="left-panel">
            <TrendsTicker />
          </div>

          <div className="center-panel">
            {isJoined && (
              <div className="video-area">
                <div className="video-placeholder">
                  🎥 Video Player
                  <span>Anime {currentAnime} - Episode {currentEpisode}</span>
                </div>
              </div>
            )}
            {showChatOverlay && isJoined && (
              <ChatOverlay animeId={currentAnime} episodeId={currentEpisode} />
            )}
            {!isJoined && (
              <div className="welcome-message">
                <h2>Welcome to Animeflix</h2>
                <p>Select an anime and episode, then join a room to start watching and chatting!</p>
                <p>Open multiple tabs to see real-time sync features in action.</p>
              </div>
            )}
          </div>

          <div className="right-panel">
            <RecommendationPanel
              recommendations={recommendations}
              watchQueue={watchQueue}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
