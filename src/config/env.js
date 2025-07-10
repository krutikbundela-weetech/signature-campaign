// Environment configuration
export const config = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || null,
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  
  // Admin Configuration
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'krutik@weetechsolution.com',
  
  // Application Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Employee Trip Signature Campaign',
  
  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Environment name
  environment: import.meta.env.MODE || 'development'
};

export default config;