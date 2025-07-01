import React from 'react';

const BanglaVerseLogo = ({ 
  size = 200, 
  showText = true, 
  className = "",
  animate = false 
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        className={animate ? "hover:scale-105 transition-transform duration-300" : ""}
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#DC2626", stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:"#F59E0B", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#16A34A", stopOpacity:1}} />
          </linearGradient>
          
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:"#16A34A", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#22C55E", stopOpacity:1}} />
          </linearGradient>
          
          {/* Drop shadow filter */}
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="4" result="offset"/>
            <feFlood floodColor="#000000" floodOpacity="0.2"/>
            <feComposite in2="offset" operator="in"/>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
          
          {/* Glow effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle with subtle pattern */}
        <circle cx="100" cy="100" r="95" fill="url(#mainGradient)" opacity="0.1" />
        
        {/* Outer decorative ring */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="url(#mainGradient)" strokeWidth="2" opacity="0.3" strokeDasharray="5,3" />
        
        {/* Main logo container */}
        <g filter="url(#dropShadow)">
          {/* Central Bengali letter "বা" (Ba) stylized */}
          <g transform="translate(100,100)">
            {/* Modern geometric interpretation of Bengali script */}
            <path 
              d="M-25,-20 L25,-20 L25,-15 L5,-15 L5,5 L15,5 L15,15 L-15,15 L-15,5 L-5,5 L-5,-15 L-25,-15 Z" 
              fill="url(#mainGradient)" 
              filter="url(#glow)" 
            />
            
            {/* Accent dot (representing the Bengali "aa" vowel mark) */}
            <circle cx="20" cy="-25" r="4" fill="#F59E0B" />
            
            {/* Modern flowing element representing language flow */}
            <path 
              d="M-30,-5 Q-10,10 10,5 Q30,0 25,20" 
              fill="none" 
              stroke="url(#accentGradient)" 
              strokeWidth="3" 
              strokeLinecap="round" 
              opacity="0.7" 
            />
          </g>
        </g>
        
        {/* Floating elements representing words/conversation */}
        <g opacity="0.6">
          {/* Small circles representing words flowing */}
          <circle cx="40" cy="60" r="3" fill="#16A34A">
            {animate && (
              <animate attributeName="cy" values="60;50;60" dur="3s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="160" cy="140" r="2.5" fill="#F59E0B">
            {animate && (
              <animate attributeName="cy" values="140;130;140" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            )}
          </circle>
          <circle cx="170" cy="70" r="2" fill="#DC2626">
            {animate && (
              <animate attributeName="cy" values="70;60;70" dur="3.5s" repeatCount="indefinite" begin="1s" />
            )}
          </circle>
          <circle cx="30" cy="130" r="2.5" fill="#22C55E">
            {animate && (
              <animate attributeName="cy" values="130;120;130" dur="2.8s" repeatCount="indefinite" begin="1.5s" />
            )}
          </circle>
        </g>
        
        {/* Text elements */}
        {showText && (
          <g fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">
            {/* "BanglaVerse" text below the logo */}
            <text x="100" y="170" fontSize="16" fill="url(#mainGradient)" filter="url(#dropShadow)">
              BanglaVerse
            </text>
            
            {/* Bengali text "বাংলাভার্স" */}
            <text x="100" y="185" fontSize="12" fill="#6B7280" fontWeight="normal">
              বাংলাভার্স
            </text>
          </g>
        )}
        
        {/* Subtle tech elements */}
        <g opacity="0.3" stroke="#16A34A" strokeWidth="1" fill="none">
          {/* Corner tech accents */}
          <path d="M20,20 L30,20 L30,30" strokeLinecap="round" />
          <path d="M180,20 L170,20 L170,30" strokeLinecap="round" />
          <path d="M20,180 L30,180 L30,170" strokeLinecap="round" />
          <path d="M180,180 L170,180 L170,170" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default BanglaVerseLogo;
