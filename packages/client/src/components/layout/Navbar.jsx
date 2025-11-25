import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary cursor-pointer">
                ANIMEFLIX
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['Home', 'Series', 'Movies', 'New & Popular', 'My List'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px]">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-white/5"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['Home', 'Series', 'Movies', 'New & Popular', 'My List'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
