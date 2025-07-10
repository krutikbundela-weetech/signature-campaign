// Utility function to get the correct API base URL
export const getApiBaseUrl = () => {
  // Check if we have a configured API base URL from environment variables
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Fallback to dynamic detection based on current hostname
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // If accessing via localhost, use localhost for API
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//localhost:3001`;
  }
  
  // If accessing via network IP, use the same IP for API
  return `${protocol}//${hostname}:3001`;
};

// API endpoints
export const API_ENDPOINTS = {
  signatures: '/api/signatures',
  saveSignature: '/api/save-signature',
  clearSignatures: '/api/clear-signatures',
  sendEmail: '/api/send-email'
};

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  console.log(`Making API call to: ${url}`);
  
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    },
    ...options
  });
};