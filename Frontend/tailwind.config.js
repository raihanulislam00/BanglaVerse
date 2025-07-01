import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Red color palette
        "red-primary": "#DC2626",      // Bright red
        "red-secondary": "#EF4444",    // Light red
        "red-dark": "#991B1B",         // Dark red
        "red-light": "#FEE2E2",        // Very light red
        
        // Green color palette
        "green-primary": "#16A34A",    // Bright green
        "green-secondary": "#22C55E",  // Light green
        "green-dark": "#15803D",       // Dark green
        "green-light": "#F0FDF4",      // Very light green
        
        // Blue color palette
        "blue-primary": "#2563EB",     // Bright blue
        "blue-secondary": "#3B82F6",   // Light blue
        "blue-dark": "#1D4ED8",        // Dark blue
        "blue-light": "#EFF6FF",       // Very light blue
        
        // Accent colors
        "accent-gold": "#F59E0B",      // Gold accent
        "neutral-gray": "#6B7280",     // Neutral gray
        "bg-light": "#F9FAFB",         // Light background
        "bg-dark": "#111827",          // Dark background
        
        // Legacy colors (kept for compatibility)
        "orange-primary": "#DC2626",
        "orange-secondary": "#EF4444",
        "cream-primary": "#F59E0B"
      },
      fontFamily: {
        "exo": ["Exo 2", "sans-serif"],
        "poppins": ["Poppins", "sans-serif"],
        "kalpurush": ["Kalpurush", "SolaimanLipi", "Arial Unicode MS", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'morph-delayed': 'morph 10s ease-in-out infinite 2s',
        'morph-slow': 'morph 12s ease-in-out infinite 4s',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'navbar-glow': 'navbarGlow 4s ease-in-out infinite',
        'logo-float': 'logoFloat 3s ease-in-out infinite',
        'icon-dance': 'iconDance 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        morph: {
          '0%, 100%': { 'border-radius': '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { 'border-radius': '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        navbarGlow: {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(22, 163, 74, 0.3)' },
          '50%': { 'box-shadow': '0 0 40px rgba(220, 38, 38, 0.3)' },
        },
        logoFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-3px) rotate(1deg)' },
          '66%': { transform: 'translateY(-2px) rotate(-1deg)' },
        },
        iconDance: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(5deg)' },
          '50%': { transform: 'scale(1.05) rotate(0deg)' },
          '75%': { transform: 'scale(1.1) rotate(-5deg)' },
        }
      }
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        banglishTheme: {
          "primary": "#16A34A",      // Green primary
          "secondary": "#DC2626",    // Red secondary
          "accent": "#F59E0B",       // Gold accent
          "neutral": "#6B7280",      // Gray neutral
          "base-100": "#FFFFFF",     // White base
          "base-200": "#F9FAFB",     // Light gray
          "base-300": "#E5E7EB",     // Medium gray
          "info": "#3ABFF8",         // Info blue
          "success": "#22C55E",      // Success green
          "warning": "#F59E0B",      // Warning gold
          "error": "#DC2626",        // Error red
        },
      },
      "light",
      "dark",
    ],
  },
};
