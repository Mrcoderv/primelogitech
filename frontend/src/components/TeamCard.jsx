import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Briefcase, Code2 } from 'lucide-react';

export default function TeamCard({ name, role, bio, image, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-6 text-center group"
    >
      <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand-blue transition-colors">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-600">
            Image
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
      <p className="text-brand-blue text-sm mb-4">{role}</p>
      <p className="text-gray-400 text-sm mb-6 line-clamp-3">{bio}</p>
      
      <div className="flex justify-center gap-4">
        <a href="#" className="text-gray-500 hover:text-white transition-colors">
          <MessageCircle className="h-4 w-4" />
        </a>
        <a href="#" className="text-gray-500 hover:text-white transition-colors">
          <Briefcase className="h-4 w-4" />
        </a>
        <a href="#" className="text-gray-500 hover:text-white transition-colors">
          <Code2 className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}
