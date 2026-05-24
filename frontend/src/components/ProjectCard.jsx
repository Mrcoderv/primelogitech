import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import { GithubIcon } from './BrandIcons';

export default function ProjectCard({ title, category, description, image, image_url, techStack, tech_stack, link, live_url, github_url, pinned = false, isPinned = false, delay = 0 }) {
  const displayImage = image || image_url;
  const displayTechStack = techStack || tech_stack || [];
  const displayLink = link || live_url || '#';
  const displayIsPinned = pinned || isPinned;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel group overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        {displayIsPinned ? (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-brand-blue text-black px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            Pinned
          </div>
        ) : null}
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={title} 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center text-gray-700 font-outfit text-2xl font-bold">
            Project Image
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {displayLink && displayLink !== '#' && (
            <a
              href={displayLink}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          )}
          {!displayLink && !github_url && (
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white transition-colors">
              <Code2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-brand-blue text-sm font-medium mb-2">{category}</div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 flex-grow">{description}</p>
        
        {displayTechStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {displayTechStack.map((tech) => (
              <span 
                key={tech} 
                className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
