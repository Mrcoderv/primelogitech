import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, MapPin, Clock, Loader2 } from 'lucide-react';
import CTASection from '../components/CTASection';
import { fetchJobs } from '../services/api';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs()
      .then(data => setJobs(data))
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
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Join <span className="text-gradient">Our Team</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto"
        >
          We appreciate your interest. Currently there are no open positions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 glass-panel p-12"
        >
          <h3 className="text-xl font-semibold text-white mb-4">No job available — we will update in future</h3>
          <p className="text-gray-400">Follow our updates or check back later for openings. You can also reach out via the contact form for collaboration inquiries.</p>
        </motion.div>

      <CTASection />
      </section>
    </div>
  );
}
