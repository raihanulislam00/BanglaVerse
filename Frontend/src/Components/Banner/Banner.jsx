import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, Keyboard, BookText, MessageSquare, Sparkles, PenTool, Type, FileText } from 'lucide-react';

const Banner = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const typingRef = useRef(null);

  useEffect(() => {
    const handleParallax = (e) => {
      if (!parallaxRef.current) return;
      const elements = parallaxRef.current.querySelectorAll('.parallax');
      elements.forEach((el) => {
        const speed = el.getAttribute('data-speed');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        el.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleParallax);
    return () => document.removeEventListener('mousemove', handleParallax);
  }, []);

  // Typing animation text
  useEffect(() => {
    const texts = ['Hello!', 'আসসালামুয়ালাইকুম!', 'Write in Banglish...', 'Get Beautiful Bangla!', 'চলো এক্সপ্লোর করি...'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      if (!typingRef.current) return;
      
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typingRef.current.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingRef.current.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(type, 1500);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 500);
      } else {
        setTimeout(type, isDeleting ? 50 : 100);
      }
    };
    
    type();
  }, []);

  return (
    <div
      ref={parallaxRef}
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-green-light via-white to-red-light"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 grid-animation opacity-10"></div>

      {/* Floating Elements Container */}
      <div className="absolute inset-0">
        {/* Dynamic Particles */}
        <div className="particles-container"></div>

        {/* Gradient Blobs */}
        <div
          className="parallax absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-gradient-to-r from-red-primary to-red-secondary opacity-20 blur-3xl animate-morph"
          data-speed="2"
        />
        <div
          className="parallax absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-green-primary to-green-secondary opacity-20 blur-3xl animate-morph-delayed"
          data-speed="3"
        />
        <div
          className="parallax absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-gradient-to-r from-accent-gold to-red-primary opacity-20 blur-3xl animate-morph-slow"
          data-speed="4"
        />
      </div>

      {/* Interactive Icon Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float absolute left-20 top-20">
          <div className="icon-card">
            <Languages size={40} className="text-red-primary" />
          </div>
        </div>
        <div className="animate-float-delayed absolute right-32 top-32">
          <div className="icon-card">
            <Keyboard size={50} className="text-green-primary" />
          </div>
        </div>
        <div className="animate-float-slow absolute bottom-32 left-40">
          <div className="icon-card">
            <BookText size={45} className="text-accent-gold" />
          </div>
        </div>
        <div className="animate-float-slower absolute bottom-40 right-24">
          <div className="icon-card">
            <MessageSquare size={55} className="text-red-primary" />
          </div>
        </div>
        {/* Additional Floating Elements */}
        <div className="animate-float absolute left-1/2 top-24">
          <div className="icon-card">
            <Type size={35} className="text-green-primary" />
          </div>
        </div>
        <div className="animate-float-delayed absolute right-1/4 bottom-1/4">
          <div className="icon-card">
            <FileText size={40} className="text-accent-gold" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-5xl">
          {/* Animated Badge */}
          <div className="mb-4 flex justify-center">
            <div className="glass-green px-4 py-2 rounded-full font-poppins animate-pulse-slow border border-green-primary/30">
              <div className="flex items-center gap-2 text-green-dark font-semibold">
                <Sparkles className="h-4 w-4 animate-spin-slow text-green-primary" />
                AI-Powered Banglish to Bangla
              </div>
            </div>
          </div>

          {/* Typing Animation */}
          <div className="h-8 mb-4">
            <span ref={typingRef} className="font-mono text-lg text-gradient-christmas font-bold"></span>
            <span className="animate-blink text-red-primary">|</span>
          </div>
          
          <h1 className="animate-fade-in font-exo text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
            <span className="text-gradient-christmas animate-gradient">
              Transform Banglish
            </span>
            <br />
            <span className="inline-block text-gray-800 animate-bounce-slow">To Beautiful <span className="text-gradient-green">বাংলা</span></span>
          </h1>

          <p className="animate-fade-in-delayed mx-auto mt-6 mb-12 max-w-3xl font-poppins text-lg text-gray-600 md:text-xl">
            Whether you're a teacher crafting stories or a student expressing ideas,
            our AI-powered platform instantly converts your Banglish text into proper
            Bangla script. Experience seamless translation with <span className="text-red-primary font-semibold">advanced features</span>
            like chatbot assistance and <span className="text-green-primary font-semibold">collaborative editing</span>.
          </p>

          {/* Interactive Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/home/translate')}
              className="btn-red-primary group"
            >
              <span className="flex items-center gap-2">
                Start Converting
                <Sparkles className="h-4 w-4 animate-spin-slow group-hover:animate-bounce" />
              </span>
            </button>
            
            <button
              onClick={() => navigate('/home/chat')}
              className="btn-green-primary group"
            >
              <span className="flex items-center gap-2">
                Try AI Chat
                <MessageSquare className="h-4 w-4 group-hover:animate-pulse" />
              </span>
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-beautiful card-red p-6 hover-lift">
              <div className="text-red-primary mb-3">
                <PenTool size={32} className="mx-auto" />
              </div>
              <h3 className="font-bold text-lg text-red-dark mb-2">Smart Editor</h3>
              <p className="text-sm text-gray-600">Real-time translation with intelligent suggestions</p>
            </div>
            
            <div className="card-beautiful card-green p-6 hover-lift">
              <div className="text-green-primary mb-3">
                <MessageSquare size={32} className="mx-auto" />
              </div>
              <h3 className="font-bold text-lg text-green-dark mb-2">AI Chatbot</h3>
              <p className="text-sm text-gray-600">Get help and practice conversations in both languages</p>
            </div>
            
            <div className="card-beautiful p-6 hover-lift border-l-4 border-accent-gold">
              <div className="text-accent-gold mb-3">
                <FileText size={32} className="mx-auto" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Document Export</h3>
              <p className="text-sm text-gray-600">Save and share your work as beautiful PDFs</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Particle Animation */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, transparent 100%);
        }
        
        .particles-container::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at center, #DC2626 1px, transparent 1px),
            radial-gradient(circle at center, #16A34A 1px, transparent 1px),
            radial-gradient(circle at center, #F59E0B 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px, 40px 40px;
          animation: particleFloat 20s linear infinite;
          opacity: 0.3;
        }

        @keyframes particleFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-40px); }
        }

        /* Grid Animation */
        .grid-animation {
          background-image: linear-gradient(#16A34A 1px, transparent 1px),
                          linear-gradient(90deg, #DC2626 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }

        /* Icon Card Styles */
        .icon-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .icon-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.95);
        }

        /* Morphing Animation */
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
        }

        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }

        .animate-morph-delayed {
          animation: morph 8s ease-in-out 2s infinite;
        }

        .animate-morph-slow {
          animation: morph 12s ease-in-out infinite;
        }

        /* Gradient Animation */
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradientFlow 5s ease infinite;
        }

        /* Other Animations */
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .animate-bounce-subtle {
          animation: bounceSoft 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Typing Animation */
        .animate-blink {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Float Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 5s ease-in-out 1s infinite;
        }

        .animate-float-slow {
          animation: float 7s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float 9s ease-in-out 2s infinite;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1.5s ease-out forwards;
        }

        .animate-fade-in-delayed {
          opacity: 0;
          animation: fadeIn 1.5s ease-out 0.8s forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Banner;