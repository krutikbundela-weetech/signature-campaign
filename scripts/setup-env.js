#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
  console.log('🚀 Signature Campaign Environment Setup\n');
  
  const deploymentType = await question('Deployment type?\n1. Local Development\n2. Same Platform (Frontend + Backend together)\n3. Separate Platforms\nChoose (1-3): ');
  
  let envConfig = {};
  
  switch (deploymentType) {
    case '1':
      envConfig = {
        PORT: '3001',
        NODE_ENV: 'development',
        VITE_FRONTEND_URL: 'http://localhost:5173',
        VITE_API_BASE_URL: 'http://localhost:3001',
        CORS_ORIGINS: 'http://localhost:5173,http://127.0.0.1:5173',
        EMAIL_HOST: 'smtp.gmail.com',
        EMAIL_PORT: '587',
        EMAIL_SECURE: 'false',
        EMAIL_USER: await question('Email address for sending notifications: '),
        EMAIL_PASS: await question('Email password/app password: '),
        SIGNATURES_DIR: 'public/SavedSignatures',
        EMPLOYEES_FILE: 'public/employees.json',
        TLS_REJECT_UNAUTHORIZED: 'false',
        APP_NAME: 'Employee Trip Signature Campaign',
        ADMIN_EMAIL: await question('Admin email address: '),
        VITE_APP_NAME: 'Employee Trip Signature Campaign',
        VITE_ADMIN_EMAIL: ''
      };
      envConfig.VITE_ADMIN_EMAIL = envConfig.ADMIN_EMAIL;
      break;
      
    case '2':
      const appUrl = await question('Your app URL (e.g., https://myapp.herokuapp.com): ');
      envConfig = {
        PORT: '3001',
        NODE_ENV: 'production',
        VITE_FRONTEND_URL: appUrl,
        VITE_API_BASE_URL: appUrl,
        CORS_ORIGINS: appUrl,
        EMAIL_HOST: 'smtp.gmail.com',
        EMAIL_PORT: '587',
        EMAIL_SECURE: 'false',
        EMAIL_USER: await question('Email address for sending notifications: '),
        EMAIL_PASS: await question('Email password/app password: '),
        SIGNATURES_DIR: 'public/SavedSignatures',
        EMPLOYEES_FILE: 'public/employees.json',
        TLS_REJECT_UNAUTHORIZED: 'true',
        APP_NAME: 'Employee Trip Signature Campaign',
        ADMIN_EMAIL: await question('Admin email address: '),
        VITE_APP_NAME: 'Employee Trip Signature Campaign',
        VITE_ADMIN_EMAIL: ''
      };
      envConfig.VITE_ADMIN_EMAIL = envConfig.ADMIN_EMAIL;
      break;
      
    case '3':
      const frontendUrl = await question('Frontend URL (e.g., https://myapp.vercel.app): ');
      const backendUrl = await question('Backend URL (e.g., https://myapi.railway.app): ');
      
      const platform = await question('Which platform config?\n1. Backend\n2. Frontend\nChoose (1-2): ');
      
      if (platform === '1') {
        // Backend configuration
        envConfig = {
          PORT: '3001',
          NODE_ENV: 'production',
          CORS_ORIGINS: frontendUrl,
          EMAIL_HOST: 'smtp.gmail.com',
          EMAIL_PORT: '587',
          EMAIL_SECURE: 'false',
          EMAIL_USER: await question('Email address for sending notifications: '),
          EMAIL_PASS: await question('Email password/app password: '),
          SIGNATURES_DIR: 'public/SavedSignatures',
          EMPLOYEES_FILE: 'public/employees.json',
          TLS_REJECT_UNAUTHORIZED: 'true',
          APP_NAME: 'Employee Trip Signature Campaign',
          ADMIN_EMAIL: await question('Admin email address: ')
        };
      } else {
        // Frontend configuration
        envConfig = {
          VITE_FRONTEND_URL: frontendUrl,
          VITE_API_BASE_URL: backendUrl,
          VITE_APP_NAME: 'Employee Trip Signature Campaign',
          VITE_ADMIN_EMAIL: await question('Admin email address: ')
        };
      }
      break;
      
    default:
      console.log('Invalid choice. Exiting...');
      rl.close();
      return;
  }
  
  // Generate .env content
  let envContent = '';
  for (const [key, value] of Object.entries(envConfig)) {
    if (value) {
      envContent += `${key}=${value}\n`;
    }
  }
  
  // Write to .env file
  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Environment configuration saved to .env file');
  console.log('\n📝 Environment variables set:');
  console.log(envContent);
  
  if (deploymentType === '3') {
    console.log('\n🔧 For deployment platforms, set these environment variables in your platform dashboard:');
    for (const [key, value] of Object.entries(envConfig)) {
      if (value) {
        console.log(`${key}=${value}`);
      }
    }
  }
  
  console.log('\n🚀 Setup complete! You can now run your application.');
  
  rl.close();
}

setupEnvironment().catch(console.error);