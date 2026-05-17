import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import CTASection from '../components/CTASection';
import { fetchProjects } from '../services/api';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(data => setProjects(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full pt-24 lg:pt-32">
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
          Explore our latest projects and see how we've helped businesses achieve their digital goals.
        </motion.p>
      </section>

      <section className="py-12 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.title}
                {...project}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
