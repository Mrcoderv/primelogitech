import React from 'react';
import { motion } from 'framer-motion';

export default function ServiceCard({ title, description, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-8 group hover:border-brand-blue/50 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
      
      <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 relative z-10 group-hover:bg-brand-blue/20 transition-colors">
        <Icon className="h-7 w-7 text-brand-blue" />
      </div>
      
      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
