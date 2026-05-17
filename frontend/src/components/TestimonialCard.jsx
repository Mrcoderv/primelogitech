import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function TestimonialCard({ name, role, company, content, image, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-8 relative group"
    >
      <Quote className="absolute top-6 right-8 h-12 w-12 text-white/5 group-hover:text-brand-blue/10 transition-colors" />
      
      <p className="text-gray-300 mb-8 relative z-10 leading-relaxed">
        "{content}"
      </p>
      
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-white/10">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-blue/20 to-brand-purple/20" />
          )}
        </div>
        <div>
          <h4 className="text-white font-semibold">{name}</h4>
          <p className="text-sm text-gray-400">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
}
