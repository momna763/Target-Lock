import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Hi! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const botResponses = [
    'I can help you find trending products, analyze market data, and provide insights about profitable opportunities.',
    'Based on current market trends, smart home devices and wearable technology are showing strong growth potential.',
    'I recommend focusing on products with profitability scores above 80% for the best returns.',
    'Let me show you some trending products in the electronics category...',
    'You can export reports from the Reports section or view detailed analytics on the Analytics page.',
    'For personalized recommendations, I suggest checking the Recommendations page based on your preferences.'
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: randomResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    'Show me trending products',
    'What are profitable categories?',
    'How to export reports?',
    'Find products for dropshipping'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {/* Hero Header */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 ${isDark ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Bot className="w-8 h-8" />
                </div>
                AI Assistant
              </h1>
              <p className="text-white/80 text-lg">Get instant help with product discovery and market insights</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="flex flex-col h-[70vh]">

      {/* Chat Window */}
      <div className={`flex-1 shadow-2xl rounded-3xl p-6 mb-6 overflow-y-auto space-y-4 border ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      } backdrop-blur-xl`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-3 max-w-xs md:max-w-md">
              {msg.sender === 'bot' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'
                }`}>
                  <Bot className={`w-4 h-4 ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line shadow-lg ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-500 text-white rounded-br-none' 
                    : isDark 
                      ? 'bg-gray-800 text-gray-200 rounded-bl-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 max-w-xs md:max-w-md">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'
              }`}>
                <Bot className={`w-4 h-4 ${
                  isDark ? 'text-indigo-400' : 'text-indigo-600'
                }`} />
              </div>
              <div className={`px-4 py-3 rounded-2xl rounded-bl-none shadow-lg ${
                isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? 'bg-gray-500' : 'bg-gray-400'
                  }`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? 'bg-gray-500' : 'bg-gray-400'
                  }`} style={{animationDelay: '0.1s'}}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? 'bg-gray-500' : 'bg-gray-400'
                  }`} style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="mb-6">
        <p className={`text-sm mb-3 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>Quick questions:</p>
        <div className="flex flex-wrap gap-3">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                isDark 
                  ? 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 border border-gray-700/50' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className={`flex items-center rounded-3xl shadow-2xl px-6 py-4 border backdrop-blur-xl ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about products and trends..."
          className={`flex-1 outline-none px-3 py-2 rounded-2xl border transition-all duration-300 focus:ring-2 focus:ring-indigo-500 ${
            isDark 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-gray-50 border-gray-300 text-gray-700 placeholder-gray-500'
          }`}
        />
        <button
          type="submit"
          className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 ml-3 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Helper Text */}
      <p className={`text-xs mt-4 text-center ${
        isDark ? 'text-gray-500' : 'text-gray-500'
      }`}>
        💡 Try asking about trending products, profitability analysis, or market insights!
      </p>
      </div>
    </div>
  );
};

export default Chatbot;
