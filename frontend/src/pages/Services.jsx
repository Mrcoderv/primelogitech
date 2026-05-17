import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import CTASection from '../components/CTASection';
import { fetchServices } from '../services/api';
import * as Icons from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then(data => setServices(data))
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
          Our <span className="text-gradient">Services</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto"
        >
          End-to-end IT services designed to accelerate your digital journey and deliver scalable solutions.
        </motion.p>
      </section>

      <section className="py-12 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = Icons[service.icon] || Icons.Code;
              return (
                <ServiceCard 
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  icon={IconComponent}
                  delay={index * 0.1}
                />
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
