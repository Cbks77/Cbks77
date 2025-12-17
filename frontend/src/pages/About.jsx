import React from 'react';
import { Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { aboutText, socialLinks } from '../mock';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
            About CBKS77
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-white tracking-tight">
              {aboutText.headline}
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              {aboutText.description}
            </p>
            <div className="pt-4">
              <h3 className="text-2xl font-bold text-red-500 mb-4">{aboutText.tagline}</h3>
            </div>

            <div className="space-y-4 pt-6">
              <h3 className="text-xl font-bold text-white">Specializations</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>3D Character Design & Modeling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Character Animation & Rigging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Visual Storytelling & Cinematics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Motion Graphics & VFX</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Branding & Merchandise Design</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500 transform rotate-2 group-hover:rotate-3 transition-transform"></div>
              <img
                src="https://customer-assets.emergentagent.com/job_cdks-merch/artifacts/qu2u3v2q_IMG_2510.JPG"
                alt="Character Sheet"
                className="relative z-10 w-full transform -rotate-2 group-hover:rotate-0 transition-transform"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://customer-assets.emergentagent.com/job_cdks-merch/artifacts/ngwpk5k9_IMG_2513.JPG"
                alt="Work 1"
                className="w-full aspect-square object-cover hover:scale-105 transition-transform"
              />
              <img
                src="https://customer-assets.emergentagent.com/job_cdks-merch/artifacts/aq93vfoy_IMG_2525.JPG"
                alt="Work 2"
                className="w-full aspect-square object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="bg-zinc-950 border border-zinc-800 p-12 text-center">
          <h2 className="text-4xl font-black text-white mb-6">Let's Connect</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Interested in collaborating or have a project in mind? Reach out through any of these channels.
          </p>
          
          <div className="flex justify-center space-x-6 mb-8">
            {socialLinks.map((social) => {
              const IconMap = {
                instagram: Instagram,
                twitter: Twitter,
                youtube: Youtube,
                video: Youtube,
                mail: Mail
              };
              const Icon = IconMap[social.icon];
              
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-900 p-4 hover:bg-red-500 transition-colors transform hover:scale-110 group"
                >
                  <Icon className="h-6 w-6 text-white" />
                </a>
              );
            })}
          </div>

          <Link to="/contact">
            <Button className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-6 rounded-none">
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;