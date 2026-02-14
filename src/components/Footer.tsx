
import React from 'react';
import logoImg from '../assets/logo/storyweaver-logo.png';

export const Footer: React.FC = () => (
  <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 border-t border-white/10 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center">
        <img
          src={logoImg}
          alt="StoryWeaver"
          className="h-16 sm:h-20 w-auto mx-auto mb-6 brightness-0 invert opacity-90"
        />
        <p className="text-white/90 text-sm mb-4 max-w-2xl mx-auto">
          Empowering young readers worldwide with free, accessible stories in multiple languages
        </p>
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
          <span>Made with</span>
          <span className="text-red-400 animate-pulse-slow text-lg">❤️</span>
          <span>© 2025</span>
        </div>
      </div>
    </div>

  </div>
);

