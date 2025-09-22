import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const navigate = useNavigate();
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
    <div className="flex flex-col h-[85vh] p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-600" />
          AI Assistant
        </h2>
        <p className="text-gray-600">Get instant help with product discovery and market insights</p>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white shadow-md rounded-2xl p-4 mb-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-3 max-w-xs md:max-w-md">
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-line shadow-sm ${msg.sender === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}
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
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="flex items-center bg-white rounded-full shadow-md px-4 py-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about products and trends..."
          className="flex-1 outline-none px-2 text-gray-700"
        />
        <button
          type="submit"
          className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition ml-2"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        💡 Try asking about trending products, profitability analysis, or market insights!
      </p>
    </div>
  );
};

export default Chatbot;
