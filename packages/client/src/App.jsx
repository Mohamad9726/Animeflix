import { useEffect, useState } from 'react';
import { useAppStore } from './store';
import { connectSocket, joinRoom, leaveRoom, sendNotification } from './services/socket';
import { ChatOverlay } from './components/ChatOverlay';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import Section from './components/layout/Section';
import { Play, ArrowLeft } from 'lucide-react';
import './App.css'; // We might want to clear this file if it conflicts, but index.css handles tailwind

function App() {
  const { user, setShowChatOverlay, showChatOverlay } = useAppStore();
  const [currentAnime, setCurrentAnime] = useState('1');
  const [currentEpisode, setCurrentEpisode] = useState('1');
  const [isJoined, setIsJoined] = useState(false);
  const [view, setView] = useState('home'); // 'home' | 'player'

  // Sample Data
  const trendingAnime = [
    { id: '1', title: 'Demon Slayer', image: 'https://images6.alphacoders.com/133/1330235.png', match: '98%', genres: ['Action', 'Fantasy'] },
    { id: '2', title: 'Jujutsu Kaisen', image: 'https://images6.alphacoders.com/111/1119799.jpg', match: '95%', genres: ['Action', 'Supernatural'] },
    { id: '3', title: 'One Piece', image: 'https://images7.alphacoders.com/611/611138.png', match: '99%', genres: ['Adventure', 'Fantasy'] },
    { id: '4', title: 'Attack on Titan', image: 'https://images7.alphacoders.com/670/670265.jpg', match: '97%', genres: ['Action', 'Drama'] },
    { id: '5', title: 'Chainsaw Man', image: 'https://images.alphacoders.com/133/1331704.png', match: '94%', genres: ['Action', 'Horror'] },
  ];

  const recommendedAnime = [
    { id: '6', title: 'Spy x Family', image: 'https://images.alphacoders.com/122/1225892.jpg', match: '96%', genres: ['Comedy', 'Action'] },
    { id: '7', title: 'My Hero Academia', image: 'https://images6.alphacoders.com/896/896899.png', match: '93%', genres: ['Superhero', 'School'] },
    { id: '8', title: 'Tokyo Revengers', image: 'https://images6.alphacoders.com/114/1144005.jpg', match: '91%', genres: ['Action', 'Sci-Fi'] },
    { id: '9', title: 'Bleach', image: 'https://images5.alphacoders.com/495/495534.jpg', match: '92%', genres: ['Action', 'Supernatural'] },
  ];

  useEffect(() => {
    connectSocket();
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handlePlay = (animeId) => {
    setCurrentAnime(animeId);
    setView('player');
    // Auto join room
    if (!isJoined) {
      joinRoom({
        animeId: animeId,
        episodeId: currentEpisode,
        userId: user.id,
        userName: user.name
      });
      setIsJoined(true);
    }
  };

  const handleBackToHome = () => {
    setView('home');
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

  if (view === 'player') {
    return (
      <div className="min-h-screen bg-background text-white">
        <Navbar />
        <div className="pt-20 px-4 h-screen flex flex-col">
          <button 
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Browse
          </button>
          
          <div className="flex-1 flex gap-6 overflow-hidden pb-6">
            <div className="flex-1 bg-black rounded-xl overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                {/* Custom Overlay Controls could go here */}
              </div>
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                <div className="text-center">
                   <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                   <p>Video Player Integration</p>
                   <p className="text-sm">Anime ID: {currentAnime} | Episode: {currentEpisode}</p>
                </div>
              </div>
            </div>
            
            <div className="w-96 glass-card rounded-xl overflow-hidden flex flex-col">
               <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
                 <h3 className="font-bold">Live Chat</h3>
               </div>
               <div className="flex-1 overflow-hidden relative">
                 <ChatOverlay animeId={currentAnime} episodeId={currentEpisode} />
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <Navbar />
      
      <main className="pb-20">
        <Hero onPlay={handlePlay} />
        
        <div className="-mt-32 relative z-10 space-y-8">
          <Section title="Trending Now" items={trendingAnime} onPlay={handlePlay} />
          <Section title="Recommended for You" items={recommendedAnime} onPlay={handlePlay} />
          <Section title="Watch It Again" items={trendingAnime.slice().reverse()} onPlay={handlePlay} />
          <Section title="New Releases" items={recommendedAnime.slice().reverse()} onPlay={handlePlay} />
        </div>
      </main>
      
      <footer className="py-12 text-center text-gray-500 text-sm glass border-t border-white/5 mt-12">
        <p>© 2024 Animeflix. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
