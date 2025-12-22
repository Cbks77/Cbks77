import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Youtube, Mail } from 'lucide-react';

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
