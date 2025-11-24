import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';

const Section = ({ title, items, onPlay }) => {
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 my-8 group relative z-0 hover:z-10">
      <h2 className="text-2xl font-bold text-white px-4 sm:px-6 lg:px-8 group-hover:text-glow transition-all duration-300">
        {title}
      </h2>
      
      <div className="relative group/row">
        <div 
          className={`absolute top-0 bottom-0 left-0 z-40 bg-black/50 w-12 m-2 flex items-center justify-center cursor-pointer opacity-0 group-hover/row:opacity-100 transition duration-300 hover:scale-110 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </div>

        <div 
          ref={rowRef}
          className="flex items-center gap-4 overflow-x-scroll scrollbar-hide px-4 sm:px-6 lg:px-8 pb-8 pt-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-[160px] md:min-w-[200px] lg:min-w-[240px]">
              <Card item={item} onClick={onPlay} />
            </div>
          ))}
        </div>

        <div 
          className="absolute top-0 bottom-0 right-0 z-40 bg-black/50 w-12 m-2 flex items-center justify-center cursor-pointer opacity-0 group-hover/row:opacity-100 transition duration-300 hover:scale-110"
          onClick={() => handleClick('right')}
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Section;
