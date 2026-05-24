import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Loader2, Building2 } from 'lucide-react';
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
    <div className="w-full pt-24 lg:pt-32 pb-20">
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
          {jobs.length > 0 
            ? "Explore our open positions and join Prime Logic Tech's growing team." 
            : "We appreciate your interest. Currently there are no open positions."}
        </motion.p>
      </section>

      {jobs.length > 0 ? (
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
          <div className="grid gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-8 hover:border-brand-blue/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
                      {job.department && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-brand-blue" />
                          <span>{job.department}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-blue" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-blue" />
                        <span>{job.job_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{job.description}</p>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Requirements:</h4>
                    <ul className="text-gray-400 space-y-1 ml-4">
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-12 text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-4">No Positions Available Right Now</h3>
            <p className="text-gray-400 mb-6">We're always looking for talented people. Check back soon or reach out via our contact form for collaboration inquiries.</p>
          </motion.div>
        </section>
      )}

      <CTASection />
    </div>
  );
}
