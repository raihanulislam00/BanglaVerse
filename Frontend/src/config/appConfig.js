// API Configuration with fallbacks for development and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://banglaverse-backend.vercel.app' || 'http://localhost:3000';

// Google Gemini API Key with fallback
const GOOGLE_GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || 'AIzaSyCaVoN1ceAPZ7BsvfEp80xQpCzDxRobMxw';

// Development mode check
const isDevelopment = import.meta.env.MODE === 'development';

// App configuration
export const config = {
  api: {
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
  },
  google: {
    geminiApiKey: GOOGLE_GEMINI_API_KEY,
  },
  app: {
    isDevelopment,
    name: 'BanglaVerse',
    version: '1.0.0',
  },
};

// Utility function to build API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${config.api.baseURL}/${cleanEndpoint}`;
};

// Error handling for API calls
export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  console.warn('API Error:', error);
  
  // If in development, show detailed error
  if (config.app.isDevelopment) {
    console.error('Detailed error:', error);
  }
  
  // Return user-friendly message
  return error.message || fallbackMessage;
};

export default config;
