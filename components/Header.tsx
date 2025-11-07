
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-4">
        <SparklesIcon className="w-10 h-10 text-brand-primary" />
        <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Gemini Multi-Modal AI Suite</h1>
            <p className="text-sm text-gray-400">Image Analysis, Editing, and Chat Powered by Google Gemini</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
