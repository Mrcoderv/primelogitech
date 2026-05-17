import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, MapPin, Clock } from 'lucide-react';
import CTASection from '../components/CTASection';

const jobs = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Contract",
  },
  {
    title: "Marketing Intern",
    department: "Marketing",
    location: "New York, NY",
    type: "Internship",
  }
];

export default function Careers() {
  return (
    <div className="w-full pt-24 lg:pt-32">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-20">
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
          Build the future of enterprise software with a team of passionate innovators.
        </motion.p>
      </section>

      <section className="py-12 mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Briefcase className="text-brand-blue" /> Open Positions
            </h2>
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-brand-blue/30 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-brand-blue">{job.department}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white/5 hover:bg-brand-blue hover:text-white transition-colors border border-white/10 group-hover:border-transparent text-sm font-medium">
                    Apply <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
