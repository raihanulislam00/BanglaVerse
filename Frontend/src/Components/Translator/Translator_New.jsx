import React, { useState } from "react";
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
  CheckCircle2
} from "lucide-react";

export default function EnhancedTranslator() {
  const [query, setQuery] = useState("");
  const [bangla, setBangla] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const translateWithBackend = async (query) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Translation failed');
      }

      return data.bangla;
    } catch (error) {
      console.error("Error during translation:", error);
      throw error;
    }
  };

  const handleTranslate = async () => {
    if (!query.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const translatedText = await translateWithBackend(query);
      setBangla(translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      setError(`Translation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-light/30 via-white to-red-light/30 p-6">
      {/* Beautiful Header Section */}
      <div className="mx-auto max-w-6xl mb-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-primary via-accent-gold to-green-primary shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:rotate-3">
                <Languages className="h-10 w-10 text-white animate-pulse-slow" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-gold to-red-secondary rounded-full animate-bounce-gentle shadow-lg"></div>
              {/* Orbital rings */}
              <div className="absolute inset-0 w-20 h-20 border-2 border-green-primary/30 rounded-3xl animate-spin-slow"></div>
              <div className="absolute -inset-2 w-24 h-24 border border-red-primary/20 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-primary via-accent-gold to-green-primary bg-clip-text text-transparent font-exo">
              Language Translator
            </h1>
            <p className="text-lg text-gray-600 font-poppins">
              Transform your <span className="font-semibold text-red-primary">Banglish</span> into beautiful <span className="bangla-text font-semibold text-green-primary">বাংলা</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="flex h-3 w-3 rounded-full bg-green-primary animate-pulse" />
              <p className="text-sm text-gray-500">Powered by Google Gemini AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-auto max-w-6xl mb-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => handleCopy(bangla)}
            disabled={!bangla}
            className="group relative px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-green-primary/20 rounded-xl hover:border-green-primary hover:bg-green-light/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-2">
              {copied ? <CheckCircle2 className="h-5 w-5 text-green-primary animate-bounce-gentle" /> : <Copy className="h-5 w-5 text-green-primary group-hover:scale-110 transition-transform duration-300" />}
              <span className="font-medium text-green-primary">{copied ? "Copied!" : "Copy Result"}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setQuery("");
              setBangla("");
              setError(null);
            }}
            className="group relative px-6 py-3 bg-gradient-to-r from-red-primary to-red-secondary text-white rounded-xl hover:from-red-secondary hover:to-red-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium">Reset All</span>
            </div>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="group relative px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-accent-gold/20 rounded-xl hover:border-accent-gold hover:bg-accent-gold/10 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Settings className={`h-5 w-5 text-accent-gold transition-transform duration-300 ${showSettings ? 'rotate-180' : 'group-hover:rotate-90'}`} />
              <span className="font-medium text-accent-gold">Settings</span>
            </div>
          </button>
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
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-primary animate-pulse" />
                        <span className="text-sm text-green-primary font-medium">Ready</span>
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
