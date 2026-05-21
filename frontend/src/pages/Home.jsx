import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import ProjectCard from '../components/ProjectCard';
import TestimonialCard from '../components/TestimonialCard';
import CTASection from '../components/CTASection';
import BrandLogo from '../components/BrandLogo';
import { services as servicesData, testimonials as testimonialsData } from '../data/mock';
import { loadHomeContent, loadProjects } from '../services/api';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [homeContent, setHomeContent] = useState(null);

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

  useEffect(() => {
    let active = true;
    loadHomeContent().then((content) => {
      if (active) {
        setHomeContent(content);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const featuredProjects = useMemo(() => {
    const pinnedProjects = projects.filter((project) => project.isPinned);
    return pinnedProjects.length > 0 ? pinnedProjects : projects.slice(0, 3);
  }, [projects]);

  const whyPoints = homeContent?.whyPoints?.length
    ? homeContent.whyPoints
    : [
        'Agile development methodology for rapid delivery',
        'Enterprise-grade security and scalability',
        'Award-winning UI/UX design team',
        '24/7 dedicated support and maintenance',
      ];

  useEffect(() => {
    if (featuredProjects.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveProjectIndex((currentIndex) => (currentIndex + 1) % featuredProjects.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [featuredProjects.length]);

  useEffect(() => {
    if (activeProjectIndex >= featuredProjects.length) {
      setActiveProjectIndex(0);
    }
  }, [activeProjectIndex, featuredProjects.length]);

  return (
    <div className="w-full">
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-blue/30 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative inline-flex items-center justify-center mb-6 sm:mb-8"
            >
              <BrandLogo size="xxl" eager className="h-44 w-44 sm:h-52 sm:w-52 md:h-60 md:w-60 drop-shadow-[0_0_32px_rgba(18,146,255,0.45)]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mb-8 text-sm sm:text-base uppercase tracking-[0.45em] text-brand-green/80"
            >
              Design. Develop. Deliver.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-brand-blue mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
              </span>
              Prime Logitech is now live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
            >
              Building the <span className="text-gradient">Digital Future</span> for Modern Enterprises
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              We craft high-performance web applications, scalable mobile solutions, and enterprise software that drives growth and innovation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/contact"
                className="bg-white text-black px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 group"
              >
                Start a Project
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/portfolio"
                className="px-8 py-4 rounded-xl font-medium glass-panel hover:bg-white/10 transition-colors"
              >
                View Our Work
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-8 font-medium tracking-widest uppercase">
            Trusted by innovative companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-xl font-bold font-outfit">ACME Corp</div>
            <div className="text-xl font-bold font-outfit">GlobalTech</div>
            <div className="text-xl font-bold font-outfit">Nexus</div>
            <div className="text-xl font-bold font-outfit">Stellar</div>
            <div className="text-xl font-bold font-outfit">Quantum</div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Expertise</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive IT solutions tailored to transform your ideas into powerful digital products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.title} {...service} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {homeContent?.whyTitle || (
                  <>
                    Why partner with <br /> <span className="text-gradient">Prime Logitech?</span>
                  </>
                )}
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                {homeContent?.whyDescription || "We don't just write code; we build strategic digital assets. Our approach combines technical excellence with business acumen to deliver measurable results."}
              </p>

              <div className="space-y-4">
                {whyPoints.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 text-brand-blue shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-green/20 rounded-3xl blur-2xl" />
              <div className="glass-panel p-8 relative rounded-3xl overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <BrandLogo size="lg" eager />
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.35em] text-brand-green/80">Studio panel</div>
                    <div className="text-sm text-gray-400">{homeContent?.whyPanelTitle || 'Creative delivery, engineered to scale'}</div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {homeContent?.whyPanelDescription || 'The right side is a living visual panel that can be customized from the admin area. It is meant to reinforce the brand rather than display loading content.'}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {['Speed', 'Security', 'Support'].map((label) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center">
                      <div className="text-brand-blue text-sm font-semibold uppercase tracking-[0.25em]">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Featured Work</h2>
              <p className="text-gray-400 text-lg max-w-2xl">
                Explore some of our recent projects that showcase our capabilities in building robust digital products.
              </p>
            </div>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-brand-blue hover:text-white transition-colors font-medium">
              View All Projects <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
              <button
                type="button"
                onClick={() => setActiveProjectIndex((currentIndex) => (currentIndex - 1 + featuredProjects.length) % featuredProjects.length)}
                disabled={featuredProjects.length <= 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
                aria-label="Previous featured project"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {featuredProjects.map((project, index) => (
                  <button
                    key={project.title}
                    type="button"
                    onClick={() => setActiveProjectIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${index === activeProjectIndex ? 'w-10 bg-brand-blue' : 'w-2.5 bg-white/30'}`}
                    aria-label={`Show featured project ${index + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectIndex((currentIndex) => (currentIndex + 1) % featuredProjects.length)}
                disabled={featuredProjects.length <= 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
                aria-label="Next featured project"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 pb-4 pt-6 md:px-6 md:pb-6">
              <div className="overflow-hidden rounded-[1.5rem]">
                {featuredProjects.length > 0 ? (
                  <motion.div
                    key={featuredProjects[activeProjectIndex]?.title}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    <ProjectCard {...featuredProjects[activeProjectIndex]} delay={0} />
                  </motion.div>
                ) : (
                  <div className="flex min-h-[24rem] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] text-gray-400">
                    No featured projects yet. Add and pin a project in the admin panel.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{homeContent?.clientSuccessTitle || 'Client Success'}</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {homeContent?.clientSuccessDescription || "Don't just take our word for it. Hear what our partners have to say about working with Prime Logitech."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} {...testimonial} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
