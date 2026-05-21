import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import CTASection from '../components/CTASection';
import { loadProjects } from '../services/api';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let active = true;

    loadProjects().then((loadedProjects) => {
      if (active) {
        setProjects(loadedProjects);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full pt-20 sm:pt-24 lg:pt-32">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6"
        >
          Our <span className="text-gradient">Portfolio</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-2 sm:px-0"
        >
          Explore our latest projects and see how we've helped businesses achieve their digital goals.
        </motion.p>
      </section>

      <section className="py-10 sm:py-12 mb-16 sm:mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project.title}
                  {...project}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-gray-400">
              No projects have been added yet. Use the admin panel to publish your first project.
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
