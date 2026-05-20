import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import CTASection from '../components/CTASection';
import { fetchProjects } from '../services/api';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjects(data);
        const featured = data.filter(p => p.is_featured);
        setFeaturedProjects(featured);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-brand-blue animate-spin" />
      </div>
    );
  }

  const currentProject = featuredProjects[currentSlide];

  return (
    <div className="w-full pt-24 lg:pt-32 pb-20">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Our <span className="text-gradient">Portfolio</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto"
        >
          Explore some of our recent projects that showcase our capabilities in building robust digital products.
        </motion.p>
      </section>

      {/* Featured Work Slideshow */}
      {featuredProjects.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              <span className="text-gradient">⭐ Featured Work</span>
            </h2>
            <p className="text-gray-400">Highlighted projects showcasing our best work</p>
          </motion.div>

          <div className="glass-panel p-8 mb-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Project Image */}
              <motion.div
                key={`image-${currentSlide}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="relative h-96 rounded-lg overflow-hidden"
              >
                <img
                  src={currentProject.image_url}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>

              {/* Project Details */}
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-3xl font-bold text-white mb-3">{currentProject.title}</h3>
                
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {currentProject.description}
                </p>

                {currentProject.technologies && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.technologies.split(',').map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-brand-blue/20 text-brand-blue rounded-full text-sm"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentProject.link && (
                  <a
                    href={currentProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-brand py-3 px-8 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    View Project →
                  </a>
                )}

                {/* Slide Counter & Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    {currentSlide + 1} / {featuredProjects.length}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={prevSlide}
                      className="p-2 rounded-full bg-white/10 hover:bg-brand-blue/30 text-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-2 rounded-full bg-white/10 hover:bg-brand-blue/30 text-white transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {featuredProjects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-brand-blue w-8' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            All <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-400">Browse through our complete portfolio</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id}
              {...project}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
