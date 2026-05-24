import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchSiteContent } from '../services/api';

export default function CTASection({ siteContent: propContent }) {
  const [fetchedContent, setFetchedContent] = useState(null);

  useEffect(() => {
    if (propContent) return;
    let active = true;
    fetchSiteContent().then((data) => {
      if (active) setFetchedContent(data);
    });
    return () => { active = false; };
  }, [propContent]);

  const content = propContent || fetchedContent || {};

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-12 text-center rounded-3xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {content.cta_title || <>Ready to <span className="text-gradient">Transform</span> Your Business?</>}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            {content.cta_description || "Join innovative startups and enterprises who trust Prime Logic Tech to build scalable, secure, and modern digital solutions."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={content.cta_button_link || "/contact"} 
              className="bg-white text-black px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 group"
            >
              {content.cta_button_text || "Start a Project"}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services" 
              className="px-8 py-4 rounded-xl font-medium border border-white/10 hover:bg-white/5 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
