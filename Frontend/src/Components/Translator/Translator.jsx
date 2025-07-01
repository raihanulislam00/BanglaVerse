import React, { useState, useEffect } from "react";
import { 
  Languages, 
  Send, 
  Loader2, 
  RotateCcw, 
  Share2, 
  Download, 
  Settings, 
  Sparkles,
  Copy,
  ArrowRight,
  CheckCircle2,
  Heart,
  Star,
  Zap,
  Globe,
  Volume2,
  BookOpen,
  MessageCircle
} from "lucide-react";

export default function EnhancedTranslator() {
  const [query, setQuery] = useState("");
  const [bangla, setBangla] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Check if speech synthesis is supported
  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  // Example phrases for demonstration
  const examples = [
    { banglish: "Ami tomake bhalobashi", bangla: "আমি তোমাকে ভালোবাসি", meaning: "I love you" },
    { banglish: "Dhonnobad", bangla: "ধন্যবাদ", meaning: "Thank you" },
    { banglish: "Kemon acho?", bangla: "কেমন আছো?", meaning: "How are you?" },
    { banglish: "Bhalo lagche", bangla: "ভালো লাগছে", meaning: "Feeling good" },
    { banglish: "Amar nam John", bangla: "আমার নাম জন", meaning: "My name is John" }
  ];

  // Auto-cycle through examples
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typing indicator
  useEffect(() => {
    if (query.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-to-Speech function for Bangla text
  const handleSpeak = (text) => {
    if (!speechSupported) {
      setError("Speech synthesis is not supported in your browser");
      return;
    }

    if (!text.trim()) {
      setError("No text to speak");
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure for Bengali language
    utterance.lang = 'bn-BD'; // Bengali (Bangladesh)
    utterance.rate = 0.8; // Slightly slower rate for clarity
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume

    // Try to find a Bengali voice, fallback to default
    const voices = window.speechSynthesis.getVoices();
    const bengaliVoice = voices.find(voice => 
      voice.lang.includes('bn') || 
      voice.lang.includes('hi') || // Hindi as fallback
      voice.name.toLowerCase().includes('bengali')
    );
    
    if (bengaliVoice) {
      utterance.voice = bengaliVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setError(null);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      setIsPlaying(false);
      setError(`Speech error: ${event.error}`);
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech function
  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const translateWithBackend = async (query) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://banglaverse-backend-api.vercel.app';
      const fullUrl = `${apiUrl}/api/translate`;
      
      console.log('Translation API URL:', fullUrl);
      console.log('Environment variables:', {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        MODE: import.meta.env.MODE,
        PROD: import.meta.env.PROD
      });

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: query }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        console.error('Response details:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries())
        });
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      // Check if response has content
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response received from server');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from server');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Translation failed');
      }

      if (!data.bangla) {
        throw new Error('No translation result received');
      }

      return data.bangla;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Translation request timed out. Please try again.');
      }
      
      console.error("Error during translation:", error);
      throw error;
    }
  };

  // Fallback translation using local dictionary/rules
  const translateWithFallback = (text) => {
    // Simple fallback translation rules for common Banglish words
    const translationMap = {
      'ami': 'আমি',
      'tumi': 'তুমি',
      'tomar': 'তোমার',
      'amar': 'আমার',
      'bhalobashi': 'ভালোবাসি',
      'bhalo': 'ভালো',
      'kemon': 'কেমন',
      'acho': 'আছো',
      'achi': 'আছি',
      'ki': 'কী',
      'keno': 'কেন',
      'kotha': 'কথা',
      'bolo': 'বলো',
      'boli': 'বলি',
      'dhonnobad': 'ধন্যবাদ',
      'khub': 'খুব',
      'valo': 'ভালো',
      'lagche': 'লাগছে',
      'hoyeche': 'হয়েছে',
      'korbo': 'করবো',
      'korte': 'করতে',
      'pari': 'পারি',
      'paro': 'পারো',
      'parbo': 'পারবো',
      'jabo': 'যাবো',
      'jao': 'যাও',
      'asi': 'আসি',
      'aso': 'আসো',
      'asbo': 'আসবো',
      'ekhon': 'এখন',
      'kal': 'কাল',
      'aj': 'আজ',
      'ghumate': 'ঘুমাতে',
      'khaite': 'খাইতে',
      'chai': 'চাই',
      'chao': 'চাও',
      'hobe': 'হবে',
      'hoye': 'হয়ে',
      'na': 'না',
      'ha': 'হ্যাঁ',
      'apni': 'আপনি',
      'apnader': 'আপনাদের',
      'amader': 'আমাদের',
      'tomader': 'তোমাদের',
      'oder': 'ওদের',
      'tader': 'তাদের'
    };

    // Split text into words and translate each
    const words = text.toLowerCase().split(/\s+/);
    const translatedWords = words.map(word => {
      // Remove punctuation for lookup
      const cleanWord = word.replace(/[^\w]/g, '');
      return translationMap[cleanWord] || word;
    });

    return translatedWords.join(' ');
  };

  const handleTranslate = async () => {
    if (!query.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First try the backend API
      const translatedText = await translateWithBackend(query);
      setBangla(translatedText);
    } catch (error) {
      console.error("Primary translation error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Translation failed";
      
      if (error.message.includes('Empty response')) {
        errorMessage = "Server returned empty response. Please try again.";
      } else if (error.message.includes('Invalid JSON')) {
        errorMessage = "Server response format error. Please contact support if this persists.";
      } else if (error.message.includes('Network error') || error.message.includes('fetch failed')) {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else if (error.message.includes('quota') || error.message.includes('API key') || error.message.includes('limits')) {
        // Use fallback translation
        try {
          const fallbackTranslation = translateWithFallback(query);
          setBangla(fallbackTranslation);
          setError("⚠️ Using offline translation mode due to API quota limits. For better accuracy, please try again later.");
          return; // Exit early since we have a fallback result
        } catch (fallbackError) {
          errorMessage = "Translation service temporarily unavailable. Please try again later.";
        }
      } else if (error.message.includes('500')) {
        errorMessage = "Translation service error. Please try again in a moment.";
      } else if (error.message.includes('404')) {
        errorMessage = "Translation service not found. Please contact support.";
      } else {
        errorMessage = `Translation failed: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-light/20 via-white to-red-light/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-red-primary/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-green-primary/10 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-accent-gold/10 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 right-1/4 animate-float">
          <Heart className="h-6 w-6 text-red-primary/20" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float" style={{animationDelay: '1s'}}>
          <Star className="h-8 w-8 text-accent-gold/20" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-float" style={{animationDelay: '3s'}}>
          <Globe className="h-7 w-7 text-green-primary/20" />
        </div>
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced Header Section */}
        <div className="mx-auto max-w-6xl mb-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative group">
                {/* Main Logo */}
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-primary via-accent-gold to-green-primary shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:rotate-6 group-hover:animate-pulse">
                  <Languages className="h-12 w-12 text-white animate-pulse-slow" />
                </div>
                
                {/* Accent Elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent-gold to-red-secondary rounded-full animate-bounce-gentle shadow-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                
                {/* Orbital Rings */}
                <div className="absolute inset-0 w-24 h-24 border-2 border-green-primary/30 rounded-3xl animate-spin-slow"></div>
                <div className="absolute -inset-2 w-28 h-28 border border-red-primary/20 rounded-full animate-ping"></div>
                <div className="absolute -inset-4 w-32 h-32 border border-accent-gold/10 rounded-full animate-pulse"></div>
                
                {/* Magic Particles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-2 h-2 bg-white rounded-full animate-ping" style={{top: '10%', left: '20%'}}></div>
                  <div className="absolute w-1 h-1 bg-accent-gold rounded-full animate-pulse" style={{top: '80%', right: '15%', animationDelay: '1s'}}></div>
                  <div className="absolute w-1.5 h-1.5 bg-green-primary rounded-full animate-bounce" style={{bottom: '10%', left: '10%', animationDelay: '2s'}}></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-primary via-accent-gold to-green-primary bg-clip-text text-transparent font-exo animate-gradient-x">
                Language Translator
              </h1>
              <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
                Transform your <span className="font-bold text-red-primary bg-red-light/30 px-2 py-1 rounded-lg">Banglish</span> into beautiful 
                <span className="bangla-text font-bold text-green-primary bg-green-light/30 px-2 py-1 rounded-lg ml-2">বাংলা</span>
              </p>
              
              {/* Stats Section */}
              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="h-5 w-5 text-accent-gold" />
                    <span className="text-2xl font-bold text-accent-gold">AI</span>
                  </div>
                  <p className="text-sm text-gray-500">Powered</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MessageCircle className="h-5 w-5 text-green-primary" />
                    <span className="text-2xl font-bold text-green-primary">99%</span>
                  </div>
                  <p className="text-sm text-gray-500">Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <BookOpen className="h-5 w-5 text-red-primary" />
                    <span className="text-2xl font-bold text-red-primary">∞</span>
                  </div>
                  <p className="text-sm text-gray-500">Words</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="flex h-3 w-3 rounded-full bg-green-primary animate-pulse" />
                <p className="text-sm text-gray-500">Live • Powered by Google Gemini AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mx-auto max-w-4xl mb-8">
          <div className="text-center mb-4">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <BookOpen className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Quick Examples</span>
              <ArrowRight className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${showExamples ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          {showExamples && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
              {examples.slice(0, 3).map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example.banglish)}
                  className="group p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-green-primary/30 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-red-primary" />
                      <span className="text-sm font-medium text-red-primary">{example.banglish}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-green-primary" />
                      <span className="text-sm bangla-text text-green-primary">{example.bangla}</span>
                    </div>
                    <p className="text-xs text-gray-500 italic">{example.meaning}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="mx-auto max-w-6xl mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleCopy(bangla)}
              disabled={!bangla}
              className="group relative px-6 py-3 bg-white/90 backdrop-blur-lg border-2 border-green-primary/20 rounded-xl hover:border-green-primary hover:bg-green-light/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
            >
              <div className="flex items-center gap-2">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-primary animate-bounce-gentle" />
                    <span className="font-semibold text-green-primary">Copied!</span>
                    <div className="absolute inset-0 bg-green-primary/10 rounded-xl animate-ping"></div>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 text-green-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold text-green-primary">Copy Result</span>
                  </>
                )}
              </div>
            </button>

            {/* Listen Button for Text-to-Speech */}
            <button
              onClick={() => isPlaying ? handleStopSpeech() : handleSpeak(bangla)}
              disabled={!bangla || !speechSupported}
              className="group relative px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-blue-primary/20 rounded-xl hover:border-blue-primary hover:bg-blue-light/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-2">
                {isPlaying ? (
                  <>
                    <div className="h-5 w-5 flex items-center justify-center">
                      <div className="w-2 h-4 bg-blue-primary rounded-sm animate-pulse"></div>
                      <div className="w-2 h-4 bg-blue-primary rounded-sm animate-pulse ml-1" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="font-semibold text-blue-primary">Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 text-blue-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold text-blue-primary">Listen</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-blue-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>

            <button
              onClick={() => {
                setQuery("");
                setBangla("");
                setError(null);
              }}
              className="group relative px-6 py-3 bg-gradient-to-r from-red-primary to-red-secondary text-white rounded-xl hover:from-red-secondary hover:to-red-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-2">
                <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-semibold">Reset All</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-red-secondary to-red-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="group relative px-6 py-3 bg-white/90 backdrop-blur-lg border-2 border-accent-gold/20 rounded-xl hover:border-accent-gold hover:bg-accent-gold/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <Settings className={`h-5 w-5 text-accent-gold transition-transform duration-300 ${showSettings ? 'rotate-180' : 'group-hover:rotate-90'}`} />
                <span className="font-semibold text-accent-gold">Settings</span>
              </div>
            </button>

            {bangla && (
              <button
                onClick={() => handleSpeak(bangla)}
                className="group relative px-6 py-3 bg-white/90 backdrop-blur-lg border-2 border-blue-400/20 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold text-blue-400">Listen</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Settings Panel */}
        {showSettings && (
          <div className="mt-6 mx-auto max-w-md">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200/50 animate-slide-up">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Translation Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl bg-green-light/30 hover:bg-green-light/50 transition-colors duration-200 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Auto Copy Translation</span>
                  <input type="checkbox" className="rounded text-green-primary focus:ring-green-primary/50 w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-red-light/30 hover:bg-red-light/50 transition-colors duration-200 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Auto Detect Language</span>
                  <input type="checkbox" className="rounded text-red-primary focus:ring-red-primary/50 w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-accent-gold/10 hover:bg-accent-gold/20 transition-colors duration-200 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Smart Suggestions</span>
                  <input type="checkbox" className="rounded text-accent-gold focus:ring-accent-gold/50 w-5 h-5" defaultChecked />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Translation Interface */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-primary/20 to-red-secondary/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-red-primary/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
              <div className="bg-gradient-to-r from-red-light to-white px-6 py-4 border-b border-red-primary/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-primary/10 border border-red-primary/20">
                    <Languages className="h-5 w-5 text-red-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Banglish Input</h3>
                    <p className="text-sm text-gray-600">Type your message in Roman Bangla</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type your Banglish text here... (e.g., 'Ami tomake bhalobashi')"
                  className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-red-primary focus:ring-2 focus:ring-red-primary/20 transition-all duration-300 resize-none text-lg font-poppins bg-white/50 backdrop-blur-sm"
                />
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {query.length} characters
                  </span>
                  <button
                    onClick={handleTranslate}
                    disabled={loading || !query.trim()}
                    className="group relative px-8 py-3 bg-gradient-to-r from-red-primary to-red-secondary text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="flex items-center gap-2">
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      )}
                      <span className="font-semibold">
                        {loading ? "Translating..." : "Translate"}
                      </span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-primary/20 to-green-secondary/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-primary/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
              <div className="bg-gradient-to-r from-green-light to-white px-6 py-4 border-b border-green-primary/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-primary/10 border border-green-primary/20">
                    <Sparkles className="h-5 w-5 text-green-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 bangla-text">Bangla Output</h3>
                    <p className="text-sm text-gray-600">Beautiful Bengali translation</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {error ? (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-red-light rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">⚠️</span>
                      </div>
                      <div>
                        <p className="text-red-primary font-semibold">Translation Error</p>
                        <p className="text-sm text-gray-600 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                ) : bangla ? (
                  <div className="space-y-4">
                    <div className="h-48 p-4 bg-green-light/20 border-2 border-green-primary/20 rounded-xl overflow-y-auto">
                      <p className="text-xl leading-relaxed bangla-text text-gray-800">
                        {bangla}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Translation complete
                      </span>
                      <div className="flex items-center gap-3">
                        {/* Listen Button in Output Panel */}
                        <button
                          onClick={() => isPlaying ? handleStopSpeech() : handleSpeak(bangla)}
                          disabled={!speechSupported}
                          className="group flex items-center gap-2 px-3 py-2 bg-blue-light/50 border border-blue-primary/20 rounded-lg hover:bg-blue-light hover:border-blue-primary transition-all duration-300 disabled:opacity-50"
                        >
                          {isPlaying ? (
                            <>
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-3 bg-blue-primary rounded-sm animate-pulse"></div>
                                <div className="w-1 h-3 bg-blue-primary rounded-sm animate-pulse" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-1 h-3 bg-blue-primary rounded-sm animate-pulse" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-xs font-medium text-blue-primary">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-4 w-4 text-blue-primary group-hover:scale-110 transition-transform duration-300" />
                              <span className="text-xs font-medium text-blue-primary">Listen</span>
                            </>
                          )}
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <span className="flex h-2 w-2 rounded-full bg-green-primary animate-pulse" />
                          <span className="text-sm text-green-primary font-medium">Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-light to-green-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Languages className="h-8 w-8 text-green-primary" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Ready for translation</p>
                        <p className="text-sm text-gray-400">Your Bengali text will appear here</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {bangla && !error && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-light/50 border border-green-primary/20 rounded-full animate-fade-in shadow-lg">
              <CheckCircle2 className="h-5 w-5 text-green-primary" />
              <span className="text-green-primary font-medium">Translation completed successfully!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
