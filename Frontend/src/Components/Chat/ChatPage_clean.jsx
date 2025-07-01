import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  Settings, 
  Download, 
  Share2,
  Heart,
  Star,
  Zap,
  Brain,
  MessageCircle,
  Copy,
  Volume2,
  Moon,
  Sun
} from 'lucide-react';

const SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_SEXUAL",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_ONLY_HIGH",
  },
];

const BANGLA_SYSTEM_PROMPT = `You are a helpful Bangla-speaking assistant. Always respond in Bangla (Bengali) language using Bengali script. Keep your responses natural and conversational, as if speaking to a Bengali speaker. If you need to include technical terms or English words, write them in Bengali script phonetically when possible. Never switch to English or any other language unless specifically asked. Even if the user writes in English, always respond in Bangla.`;

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  
  const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-002' });
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const initChat = async () => {
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
      await chat.sendMessage(BANGLA_SYSTEM_PROMPT);
      chatRef.current = chat;
    };
    initChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  // Typing indicator
  useEffect(() => {
    if (inputMessage.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [inputMessage]);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearChat = async () => {
    setMessages([]);
    setCurrentResponse('');
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    await chat.sendMessage(BANGLA_SYSTEM_PROMPT);
    chatRef.current = chat;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setCurrentResponse('ভাবছি...');

    try {
      const result = await chatRef.current.sendMessage(userMessage, {
        safetySettings: SAFETY_SETTINGS
      });

      setCurrentResponse('');
      let fullResponse = '';
      
      const response = await result.response;
      const text = response.text();
      
      if (animationsEnabled) {
        const words = text.split('');
        for (let i = 0; i < words.length; i++) {
          fullResponse += words[i];
          setCurrentResponse(fullResponse + '▋');
          if (i % Math.floor(Math.random() * (10 - 5 + 1) + 5) === 0) {
            await sleep(50);
          }
        }
      } else {
        fullResponse = text;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      setCurrentResponse('');

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'দুঃখিত, একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।'
      }]);
      setCurrentResponse('');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadChat = () => {
    const chatContent = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bangla-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareChat = () => {
    if (navigator.share) {
      navigator.share({
        title: 'বাংলা চ্যাটবট কথোপকথন',
        text: messages
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n\n'),
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-green-light/20 via-white to-red-light/20'} relative overflow-hidden transition-all duration-500`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-32 h-32 ${darkMode ? 'bg-gradient-to-r from-purple-500/20 to-transparent' : 'bg-gradient-to-r from-red-primary/10 to-transparent'} rounded-full blur-3xl ${animationsEnabled ? 'animate-float' : ''}`}></div>
        <div className={`absolute top-40 right-20 w-48 h-48 ${darkMode ? 'bg-gradient-to-r from-blue-500/20 to-transparent' : 'bg-gradient-to-r from-green-primary/10 to-transparent'} rounded-full blur-3xl ${animationsEnabled ? 'animate-float' : ''}`} style={{animationDelay: '2s'}}></div>
        <div className={`absolute bottom-32 left-32 w-40 h-40 ${darkMode ? 'bg-gradient-to-r from-pink-500/20 to-transparent' : 'bg-gradient-to-r from-accent-gold/10 to-transparent'} rounded-full blur-3xl ${animationsEnabled ? 'animate-float' : ''}`} style={{animationDelay: '4s'}}></div>
        
        {/* Floating Icons */}
        <div className={`absolute top-32 right-1/4 ${animationsEnabled ? 'animate-float' : ''}`}>
          <MessageCircle className={`h-6 w-6 ${darkMode ? 'text-blue-400/30' : 'text-green-primary/20'}`} />
        </div>
        <div className={`absolute bottom-1/4 left-1/4 ${animationsEnabled ? 'animate-float' : ''}`} style={{animationDelay: '1s'}}>
          <Brain className={`h-8 w-8 ${darkMode ? 'text-purple-400/30' : 'text-accent-gold/20'}`} />
        </div>
        <div className={`absolute top-1/2 right-1/3 ${animationsEnabled ? 'animate-float' : ''}`} style={{animationDelay: '3s'}}>
          <Sparkles className={`h-7 w-7 ${darkMode ? 'text-pink-400/30' : 'text-red-primary/20'}`} />
        </div>
        <div className={`absolute top-1/4 left-1/3 ${animationsEnabled ? 'animate-float' : ''}`} style={{animationDelay: '1.5s'}}>
          <Heart className={`h-5 w-5 ${darkMode ? 'text-red-400/20' : 'text-red-primary/15'}`} />
        </div>
        <div className={`absolute bottom-1/3 right-1/4 ${animationsEnabled ? 'animate-float' : ''}`} style={{animationDelay: '3.5s'}}>
          <Star className={`h-6 w-6 ${darkMode ? 'text-yellow-400/30' : 'text-accent-gold/20'}`} />
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={downloadChat}
          className={`group relative p-3 ${darkMode ? 'bg-gray-800/90 border-gray-600 hover:bg-green-600' : 'bg-white/90 border-gray-200 hover:bg-green-primary'} backdrop-blur-sm border rounded-2xl hover:text-white hover:border-green-primary transition-all duration-300 hover:scale-110 hover:shadow-xl`}
          title="চ্যাট ডাউনলোড করুন"
        >
          <Download className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </button>
        
        <button
          onClick={shareChat}
          className={`group relative p-3 ${darkMode ? 'bg-gray-800/90 border-gray-600 hover:bg-blue-600' : 'bg-white/90 border-gray-200 hover:bg-blue-primary'} backdrop-blur-sm border rounded-2xl hover:text-white hover:border-blue-primary transition-all duration-300 hover:scale-110 hover:shadow-xl`}
          title="চ্যাট শেয়ার করুন"
        >
          <Share2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`group relative p-3 ${darkMode ? 'bg-gray-800/90 border-gray-600 hover:bg-yellow-600' : 'bg-white/90 border-gray-200 hover:bg-accent-gold'} backdrop-blur-sm border rounded-2xl hover:text-white hover:border-accent-gold transition-all duration-300 hover:scale-110 hover:shadow-xl`}
          title="সেটিংস"
        >
          <Settings className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${showSettings ? 'rotate-90' : ''}`} />
        </button>
        
        <button
          onClick={clearChat}
          className={`group relative p-3 ${darkMode ? 'bg-gray-800/90 border-gray-600 hover:bg-red-600' : 'bg-white/90 border-gray-200 hover:bg-red-primary'} backdrop-blur-sm border rounded-2xl hover:text-white hover:border-red-primary transition-all duration-300 hover:scale-110 hover:shadow-xl`}
          title="চ্যাট মুছুন"
        >
          <Trash2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`absolute top-20 right-6 z-30 w-80 rounded-3xl ${darkMode ? 'bg-gray-800/95 border-gray-600' : 'bg-white/95 border-gray-100'} backdrop-blur-xl p-6 shadow-2xl border animate-slide-up`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-accent-gold to-red-secondary">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} font-exo`}>সেটিংস</h3>
          </div>
          <div className="space-y-4">
            <label className={`flex items-center gap-3 p-4 rounded-2xl ${darkMode ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-gray-50 border-gray-100'} transition-colors duration-200 cursor-pointer border`}>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-green-primary focus:ring-green-primary/20" 
                checked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
              />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>টাইপিং অ্যানিমেশন</span>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-2xl ${darkMode ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-gray-50 border-gray-100'} transition-colors duration-200 cursor-pointer border`}>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-green-primary focus:ring-green-primary/20" 
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>অটো-স্ক্রল</span>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-2xl ${darkMode ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-gray-50 border-gray-100'} transition-colors duration-200 cursor-pointer border`}>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-green-primary focus:ring-green-primary/20"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <Volume2 className="h-4 w-4" />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>সাউন্ড ইফেক্ট</span>
            </label>
            <label className={`flex items-center gap-3 p-4 rounded-2xl ${darkMode ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-gray-50 border-gray-100'} transition-colors duration-200 cursor-pointer border`}>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded text-green-primary focus:ring-green-primary/20"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>ডার্ক মোড</span>
            </label>
          </div>
        </div>
      )}

      <div className="relative z-10 flex h-screen w-full flex-col pt-6">
        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && !currentResponse && (
              <div className="text-center py-16">
                <div className="relative group mb-8">
                  <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-primary via-accent-gold to-green-primary shadow-2xl mx-auto ${animationsEnabled ? 'animate-bounce-gentle' : ''}`}>
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                  {animationsEnabled && (
                    <>
                      <div className="absolute inset-0 w-24 h-24 border-2 border-green-primary/30 rounded-3xl animate-spin-slow mx-auto"></div>
                      <div className="absolute -inset-2 w-28 h-28 border border-red-primary/20 rounded-full animate-ping mx-auto"></div>
                      
                      {/* Floating particles around logo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-3 h-3 bg-white rounded-full animate-ping" style={{top: '15%', left: '25%'}}></div>
                        <div className="absolute w-2 h-2 bg-accent-gold rounded-full animate-pulse" style={{top: '75%', right: '20%', animationDelay: '1s'}}></div>
                        <div className="absolute w-2 h-2 bg-green-primary rounded-full animate-bounce" style={{bottom: '15%', left: '15%', animationDelay: '2s'}}></div>
                      </div>
                    </>
                  )}
                </div>
                
                <h1 className={`text-4xl font-bold bg-gradient-to-r from-red-primary via-accent-gold to-green-primary bg-clip-text text-transparent font-exo ${animationsEnabled ? 'animate-gradient-x' : ''} mb-4`}>
                  বাংলা AI চ্যাটবট
                </h1>
                <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-poppins max-w-2xl mx-auto leading-relaxed bangla-text mb-4`}>
                  আমি আপনার প্রশ্নের উত্তর দিতে এবং বাংলায় কথোপকথন করতে এখানে আছি। 
                  যেকোনো প্রশ্ন করুন বা আলোচনা শুরু করুন।
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-green-900/50' : 'bg-green-light/50'} rounded-xl`}>
                    <span className="flex h-3 w-3 rounded-full bg-green-primary animate-pulse shadow-lg" />
                    <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-dark'} font-medium`}>Google Gemini দ্বারা পরিচালিত</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-yellow-900/50' : 'bg-accent-gold/20'} rounded-xl`}>
                    <Brain className={`h-4 w-4 ${darkMode ? 'text-yellow-400' : 'text-accent-gold'}`} />
                    <span className={`text-sm font-bold ${darkMode ? 'text-yellow-400' : 'text-accent-gold'}`}>AI শক্তিসহ</span>
                  </div>
                </div>
                
                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
                  {[
                    'আপনি কেমন আছেন?', 
                    'বাংলাদেশ সম্পর্কে বলুন', 
                    'একটি গল্প বলুন', 
                    'আজকের আবহাওয়া কেমন?',
                    'কবিতা লিখুন',
                    'রান্নার রেসিপি দিন'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`group px-6 py-3 text-sm ${darkMode ? 'bg-gray-800/70 border-gray-600 hover:bg-gradient-to-r hover:from-green-900 hover:to-red-900/30 hover:border-green-500/50 text-gray-300 group-hover:text-green-300' : 'bg-white/70 border-gray-200 hover:bg-gradient-to-r hover:from-green-light hover:to-red-light/30 hover:border-green-primary/50 text-gray-700 group-hover:text-green-dark'} backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    >
                      <span className="transition-colors duration-300 bangla-text font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${animationsEnabled ? 'animate-fade-in' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-primary to-green-secondary shadow-lg hover:shadow-xl transition-all duration-300 ${animationsEnabled ? 'hover:scale-110' : ''}`}>
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                )}
                
                <div className="group relative max-w-2xl">
                  <div
                    className={`relative rounded-3xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-red-primary to-red-secondary text-white rounded-br-lg'
                        : darkMode 
                          ? 'bg-gray-800/90 backdrop-blur-sm text-gray-100 border border-gray-600 rounded-bl-lg'
                          : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-100 rounded-bl-lg'
                    }`}
                  >
                    <div className="bangla-text leading-relaxed font-medium">
                      {message.content}
                    </div>
                    
                    {/* Message Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleCopy(message.content)}
                        className={`p-2 rounded-lg transition-all duration-200 ${animationsEnabled ? 'hover:scale-110' : ''} ${
                          message.role === 'user' 
                            ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                            : darkMode
                              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                              : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                        }`}
                        title="কপি করুন"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {new Date().toLocaleTimeString('bn-BD')}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-primary to-red-secondary shadow-lg hover:shadow-xl transition-all duration-300 ${animationsEnabled ? 'hover:scale-110' : ''}`}>
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Current Response (Typing Animation) */}
            {currentResponse && (
              <div className={`flex items-end gap-4 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-primary to-green-secondary shadow-lg ${animationsEnabled ? 'animate-pulse' : ''}`}>
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="relative max-w-2xl">
                  <div className={`relative rounded-3xl rounded-bl-lg px-6 py-4 shadow-lg border ${
                    darkMode 
                      ? 'bg-gray-800/90 backdrop-blur-sm text-gray-100 border-gray-600'
                      : 'bg-white/90 backdrop-blur-sm text-gray-800 border-gray-100'
                  }`}>
                    <div className="bangla-text leading-relaxed font-medium">
                      {currentResponse}
                    </div>
                  </div>
                  <div className={`mt-2 flex items-center gap-2 text-xs text-green-primary ${animationsEnabled ? 'animate-pulse' : ''}`}>
                    <Sparkles className={`h-3 w-3 ${animationsEnabled ? 'animate-spin' : ''}`} />
                    <span className="font-medium">AI লিখছে...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="relative px-8 py-6">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <div className="flex gap-4 items-end">
              <div className="relative flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="এখানে আপনার বার্তা লিখুন... (বাংলা বা ইংরেজিতে)"
                    className={`w-full rounded-3xl border-2 px-8 py-5 pr-16 shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-green-primary/20 transition-all duration-300 hover:shadow-xl bangla-text text-lg ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-800/90 backdrop-blur-sm text-gray-100 focus:border-green-400'
                        : 'border-gray-200 bg-white/90 backdrop-blur-sm text-gray-800 focus:border-green-primary'
                    }`}
                    disabled={isLoading}
                  />
                  
                  {/* Input Status Indicators */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isLoading && (
                      <div className="flex items-center gap-2">
                        <Sparkles className={`h-5 w-5 text-green-primary ${animationsEnabled ? 'animate-spin' : ''}`} />
                        <span className="text-sm text-green-primary font-medium">পাঠানো হচ্ছে...</span>
                      </div>
                    )}
                    {isTyping && !isLoading && animationsEnabled && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-accent-gold rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-accent-gold rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-accent-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Character Count and Helper Text */}
                <div className="mt-3 flex items-center justify-between">
                  <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Zap className="h-3 w-3" />
                    <span>Shift + Enter দিয়ে নতুন লাইন যোগ করুন</span>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {inputMessage.length > 0 && `${inputMessage.length} অক্ষর`}
                  </div>
                </div>
              </div>
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`group relative flex items-center gap-3 rounded-3xl bg-gradient-to-r from-green-primary to-green-secondary px-10 py-5 text-white shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
                  animationsEnabled && !isLoading ? 'hover:scale-105' : ''
                } ${isLoading ? 'hover:scale-100' : ''}`}
              >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-secondary to-green-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative z-10 font-semibold bangla-text text-lg">
                  {isLoading ? 'পাঠানো হচ্ছে...' : 'পাঠান'}
                </span>
                <Send className={`relative z-10 h-6 w-6 transition-transform duration-300 ${animationsEnabled ? 'group-hover:translate-x-1 group-hover:scale-110' : ''}`} />
                
                {/* Shimmer Effect */}
                {!isLoading && animationsEnabled && (
                  <div className="absolute inset-0 -top-full h-full w-full transform skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer"></div>
                )}
              </button>
            </div>
            
            {/* Copy Success Message */}
            {copied && (
              <div className={`mt-4 flex items-center justify-center gap-2 text-sm text-green-primary ${animationsEnabled ? 'animate-fade-in' : ''}`}>
                <Copy className="h-4 w-4" />
                <span className="font-medium">কপি হয়েছে!</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
