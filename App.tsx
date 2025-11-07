import React, { useState } from 'react';
import { AppTab } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ImageDetector from './components/ImageDetector';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DETECTOR);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DETECTOR:
        return <ImageDetector />;
      case AppTab.CHATBOT:
        return <Chatbot />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-4 sm:p-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
