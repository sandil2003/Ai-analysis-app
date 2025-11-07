
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import type { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(createChatSession());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chat || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = await chat.sendMessageStream({ message: input });
        
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', text: '...' }]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800/50 rounded-t-lg">
            {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-gray-700 text-gray-200'}`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            ))}
             {isLoading && messages[messages.length-1]?.role === 'user' && (
                <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-700 text-gray-200">
                       <div className="flex items-center space-x-2">
                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                         <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                       </div>
                    </div>
                </div>
             )}
            <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-gray-800 rounded-b-lg">
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:ring-brand-primary focus:border-brand-primary transition"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-brand-primary text-white p-2 rounded-full hover:bg-brand-secondary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Chatbot;
