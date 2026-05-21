import React from 'react';
import { motion } from 'framer-motion';
import TeamCard from '../components/TeamCard';
import CTASection from '../components/CTASection';
import { Target, Eye, Award, Users } from 'lucide-react';
import { loadTeam } from '../services/api';

export default function About() {
  const [team, setTeam] = React.useState([]);

  React.useEffect(() => {
    let active = true;

    loadTeam().then((loadedTeam) => {
      if (active) {
        setTeam(loadedTeam);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { label: "Projects Delivered", value: "150+" },
    { label: "Happy Clients", value: "98%" },
    { label: "Team Members", value: "45+" },
    { label: "Years Experience", value: "10+" }
  ];

  return (
    <div className="w-full pt-20 sm:pt-24 lg:pt-32">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6"
        >
          About <span className="text-gradient">Prime Logic Tech</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-2 sm:px-0"
        >
          We are a team of passionate technologists dedicated to building software that empowers businesses to thrive in the digital age.
        </motion.p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8"
            >
              <Target className="h-10 w-10 text-brand-blue mb-6" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                To deliver innovative, scalable, and secure technology solutions that solve complex business challenges and create meaningful digital experiences for users worldwide.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8"
            >
              <Eye className="h-10 w-10 text-brand-green mb-6" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-400 leading-relaxed">
                To be the global leader in digital transformation, setting new standards for software excellence and driving the future of enterprise technology.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 font-outfit">{stat.value}</div>
                <div className="text-sm text-brand-blue font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Meet Our Leadership</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
              The visionary minds leading our team of talented engineers and designers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member, index) => (
              <TeamCard 
                key={member.name}
                {...member}
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
