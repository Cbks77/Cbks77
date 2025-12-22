import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Youtube, Mail } from 'lucide-react';

// Discord custom icon since lucide doesn't have it
const DiscordIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

// Social media links
const socialLinks = [
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/cbks77.nft' },
  { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/profile.php?id=61577859518540' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/cbks77' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@cbks77' },
];

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-3xl font-black tracking-tighter text-white">
              CBKS<span className="text-red-500">77</span>
            </div>
            <p className="text-gray-400 text-sm">
              Graphic Designer & 3D Animator
              <br />
              Creating bold, unbothered visuals.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                Home
              </Link>
              <Link to="/portfolio" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                Portfolio
              </Link>
              <Link to="/shop" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                Shop
              </Link>
              <Link to="/about" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Social Media & Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-500 transition-colors transform hover:scale-110"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <div className="pt-4">
              <a 
                href="mailto:hello@cbks77.com" 
                className="inline-flex items-center text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                <Mail className="h-4 w-4 mr-2" />
                hello@cbks77.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CBKS77. All rights reserved. UNBOTHERED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
