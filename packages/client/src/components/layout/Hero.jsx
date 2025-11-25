import React from 'react';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ anime, onPlay }) => {
  // Default fallback if no anime provided
  const heroAnime = anime || {
    id: "hero-1",
    title: "Demon Slayer: Kimetsu no Yaiba",
    description: "Tanjiro Kamado, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself.",
    image: "https://images6.alphacoders.com/133/1330235.png", 
    match: "98% Match"
  };

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroAnime.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-6"
        >
          <div className="flex items-center gap-4 text-green-400 font-semibold tracking-wide">
            <span>{heroAnime.match}</span>
            <span className="text-gray-300">2024</span>
            <span className="border border-gray-500 px-1 rounded text-xs text-gray-300">TV-MA</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white text-glow leading-tight">
            {heroAnime.title}
          </h1>

          <p className="text-lg text-gray-200 line-clamp-3 leading-relaxed drop-shadow-md">
            {heroAnime.description}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => onPlay && onPlay(heroAnime.id)}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded hover:bg-white/90 transition-colors font-bold text-lg"
            >
              <Play className="fill-black h-6 w-6" />
              Play
            </button>
            <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded hover:bg-white/30 transition-colors font-bold text-lg border border-white/10">
              <Info className="h-6 w-6" />
              More Info
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
