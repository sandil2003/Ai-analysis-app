import React from 'react';
import { AppTab } from '../types';
import { FingerPrintIcon } from './icons/FingerPrintIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface TabsProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const tabOptions = [
  { name: AppTab.DETECTOR, icon: FingerPrintIcon },
  { name: AppTab.CHATBOT, icon: ChatBubbleIcon },
];

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-1 sm:space-x-4 px-4 sm:px-8" aria-label="Tabs">
        {tabOptions.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`${
              activeTab === tab.name
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            } group inline-flex items-center py-4 px-1 sm:px-2 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out focus:outline-none`}
            aria-current={activeTab === tab.name ? 'page' : undefined}
          >
            <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
