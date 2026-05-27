import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Briefcase, Code2, Camera, Mail, MapPin, Phone, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { subscribeNewsletter, fetchSiteContent } from '../services/api';

export default function Footer({ siteContent: propContent }) {
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
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
  const footerDesc = content.footer_description;
  const footerEmail = content.footer_email;
  const footerPhone = content.footer_phone;

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNewsletterLoading(true);
    setNewsletterError('');
    setNewsletterSuccess(false);
    try {
      await subscribeNewsletter(email);
      setNewsletterSuccess(true);
      setEmail('');
    } catch (err) {
      setNewsletterError(err.response?.data?.error || err.response?.data?.email?.[0] || 'Subscription failed. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const socialLinks = {
    facebook: content.footer_facebook,
    twitter: content.footer_twitter,
    linkedin: content.footer_linkedin,
    instagram: content.footer_instagram,
    github: content.footer_github,
  };

  return (
    <footer className="bg-[#030303] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BrandLogo size="md" eager />
              <div>
                <div className="font-outfit font-bold text-xl tracking-tight text-white">
                  Prime Logic tech
                </div>
                <div className="text-sm text-brand-green/80">
                  Design. Develop. Deliver.
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {footerDesc || "Empowering startups and enterprises with cutting-edge IT solutions. We build scalable, secure, and modern digital experiences."}
            </p>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors">
                  <Briefcase className="h-5 w-5" />
                </a>
              )}
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Code2 className="h-5 w-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Camera className="h-5 w-5" />
                </a>
              )}
              {!socialLinks.facebook && !socialLinks.linkedin && !socialLinks.github && !socialLinks.instagram && (
                <>
                  <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors" title="Social link coming soon">
                    <MessageCircle className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors" title="Social link coming soon">
                    <Briefcase className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Social link coming soon">
                    <Code2 className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors" title="Social link coming soon">
                    <Camera className="h-5 w-5" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'About', 'Services', 'Portfolio', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="h-5 w-5 text-brand-blue shrink-0" />
                <a 
                  href="https://maps.app.goo.gl/Jjedt1uESwcftLYd7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand-blue transition-colors"
                  title="Open location in Google Maps"
                >
                  Bhaktapur, Thimi, Nepal
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-5 w-5 text-brand-blue shrink-0" />
                <span>{footerPhone || '+1 (555) 123-4567'}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-5 w-5 text-brand-blue shrink-0" />
                <a 
                  href="mailto:primelogictech3@gmail.com"
                  className="hover:text-brand-blue transition-colors"
                >
                  primelogictech3@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest updates and news.
            </p>
            <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand-blue text-sm text-white"
              />
              {newsletterError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {newsletterError}
                </p>
              )}
              {newsletterSuccess && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Subscribed successfully!
                </p>
              )}
              <button
                type="submit"
                disabled={newsletterLoading}
                className="w-full bg-gradient-brand py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {newsletterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Prime Logitech. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
