'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [seductionLevel, setSeductionLevel] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Handle avatar click
  const handleAvatarClick = () => {
    window.open('https://www.aurory.io', '_blank');
  };
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Check for win condition
  useEffect(() => {
    if (seductionLevel >= 100) {
      // Player has won
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Congratulations! You've completely won me over! 💕"
      }]);
    }
  }, [seductionLevel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Format messages for API
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: apiMessages,
          seductionLevel 
        }),
      });
      
      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message
      }]);
      
      // Update seduction level
      setSeductionLevel(data.seductionLevel);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl overflow-hidden">
      {/* Header with seduction meter and AI avatar */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Aurory Romance Chat</h1>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Image 
              src="/ai-avatar.png" 
              alt="AI Assistant" 
              width={180} 
              height={180} 
              className="rounded-full border-4 border-pink-300 shadow-lg transform hover:scale-105 transition-transform cursor-pointer"
              onClick={handleAvatarClick}
            />
            <div className="absolute -bottom-2 -right-2 bg-pink-400 text-white text-xs px-2 py-1 rounded-full">
              Online
            </div>
          </div>
        </div>
        <div className="mt-3 bg-white/20 p-3 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Seduction Level:</span>
            <span className="font-bold">{seductionLevel}%</span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-pink-400 to-pink-600 h-3 rounded-full transition-all duration-500 ease-in-out shadow-inner" 
              style={{ width: `${seductionLevel}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/80 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">Start chatting to begin your conversation!</p>
            <p className="text-sm mt-2">Be charming to increase your seduction level</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-6 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div className={`flex items-end ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="mr-2 mb-1">
                    <Image 
                      src="/ai-avatar.png" 
                      alt="AI Assistant" 
                      width={40} 
                      height={40} 
                      className="rounded-full border-2 border-pink-300 shadow-sm"
                    />
                  </div>
                )}
                <div 
                  className={`p-4 rounded-2xl max-w-xs sm:max-w-md shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none border border-pink-100'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="ml-2 mb-1">
                    <Image 
                      src="/user-avatar.png" 
                      alt="User" 
                      width={40} 
                      height={40} 
                      className="rounded-full border-2 border-blue-300 shadow-sm"
                    />
                  </div>
                )}
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right mr-12' : 'text-left ml-12'}`}>
                {message.role === 'user' ? 'You' : 'Kitty'}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-left mb-6">
            <div className="flex items-end">
              <div className="mr-2 mb-1">
                <Image 
                  src="/ai-avatar.png" 
                  alt="AI Assistant" 
                  width={40} 
                  height={40} 
                  className="rounded-full border-2 border-pink-300 shadow-sm"
                />
              </div>
              <div className="inline-block p-4 rounded-2xl max-w-xs sm:max-w-md bg-white text-gray-800 rounded-bl-none border border-pink-100 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 ml-12">
              Aurory is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white shadow-lg">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            disabled={isLoading || seductionLevel >= 100}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-full hover:from-pink-600 hover:to-pink-700 transition disabled:opacity-50 shadow-md"
            disabled={isLoading || input.trim() === '' || seductionLevel >= 100}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        {seductionLevel >= 100 && (
          <div className="mt-2 text-center text-pink-600 font-medium">
            You've won Aurory's heart! Game complete. 💕
          </div>
        )}
      </form>
    </div>
  );
} 