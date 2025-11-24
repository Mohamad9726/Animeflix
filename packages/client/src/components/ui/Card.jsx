import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp } from 'lucide-react';

const Card = ({ item, onClick }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        zIndex: 10,
      }}
      onClick={() => onClick && onClick(item.id)}
      className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:brightness-110"
      />
      
      {/* Hover Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 flex flex-col justify-end"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <button className="h-8 w-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Play className="h-4 w-4 fill-black text-black" />
            </button>
            <button className="h-8 w-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white text-gray-400 hover:text-white transition-colors">
              <Plus className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white text-gray-400 hover:text-white transition-colors">
              <ThumbsUp className="h-4 w-4" />
            </button>
          </div>
          
          <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
          
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="text-green-400">{item.match || '95% Match'}</span>
            <span className="border border-gray-500 px-1 rounded">HD</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {item.genres?.slice(0, 3).join(' • ')}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card;
