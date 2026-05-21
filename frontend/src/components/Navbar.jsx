import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import BrandLogo from './BrandLogo';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <BrandLogo size="sm" eager />
            <div className="leading-tight max-w-[10rem] sm:max-w-none">
              <div className="font-outfit font-bold text-lg sm:text-xl tracking-tight text-white">
                Prime Logitech
              </div>
              <div className="hidden sm:block text-[10px] uppercase tracking-[0.35em] text-brand-green/80">
                Design. Develop. Deliver.
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-brand-blue bg-white/5"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t border-white/5"
          >
            <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-white/10 bg-[#050505]/95 p-2 space-y-1 shadow-xl">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block px-3 py-3 rounded-xl text-base font-medium transition-colors duration-200",
                      isActive
                        ? "text-brand-blue bg-white/5"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
