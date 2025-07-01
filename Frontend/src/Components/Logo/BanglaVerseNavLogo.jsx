import React from 'react';

const BanglaVerseNavLogo = ({ size = 40, className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 50 50" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-110"
      >
        <defs>
          <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#DC2626", stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:"#F59E0B", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#16A34A", stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        {/* Simplified logo for navbar */}
        <rect width="50" height="50" rx="12" fill="url(#navGradient)" />
        
        {/* Simplified Bengali letter */}
        <g transform="translate(25,25)">
          <path 
            d="M-12,-10 L12,-10 L12,-7 L3,-7 L3,3 L7,3 L7,7 L-7,7 L-7,3 L-3,3 L-3,-7 L-12,-7 Z" 
            fill="white" 
            opacity="0.9" 
          />
          <circle cx="10" cy="-12" r="2" fill="white" opacity="0.8" />
        </g>
      </svg>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-red-primary via-accent-gold to-green-primary bg-clip-text text-transparent font-exo">
          BanglaVerse
        </span>
        <span className="text-xs text-gray-500 bangla-text">বাংলাভার্স</span>
      </div>
    </div>
  );
};

export default BanglaVerseNavLogo;
