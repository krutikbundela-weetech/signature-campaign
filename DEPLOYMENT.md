# Deployment Guide

This guide explains how to deploy the Signature Campaign application to different environments using the environment configuration system.

## Environment Configuration

The application uses environment variables to handle different deployment scenarios. All configuration is managed through `.env` files.

### Environment Files

- `.env` - Development environment (default)
- `.env.production` - Production environment
- `.env.example` - Template file with all available variables

### Key Environment Variables

#### Server Configuration
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

#### Frontend Configuration
- `VITE_FRONTEND_URL` - Frontend application URL
- `VITE_API_BASE_URL` - Backend API URL

#### CORS Configuration
- `CORS_ORIGINS` - Comma-separated list of allowed origins

#### Email Configuration
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP server port
- `EMAIL_SECURE` - Use secure connection (true/false)
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password/app password

#### Application Configuration
- `APP_NAME` - Application name
- `ADMIN_EMAIL` - Administrator email address
- `VITE_ADMIN_EMAIL` - Client-side admin email (for UI controls)

## Deployment Scenarios

### 1. Same Platform Deployment (Frontend + Backend together)

For platforms like Heroku, Railway, or Render where you deploy everything together:

1. Copy `.env.example` to `.env.production`
2. Update the URLs to match your deployment domain:
   ```env
   VITE_FRONTEND_URL=https://your-app.herokuapp.com
   VITE_API_BASE_URL=https://your-app.herokuapp.com
   CORS_ORIGINS=https://your-app.herokuapp.com
   ```

### 2. Separate Platform Deployment (Frontend and Backend on different platforms)

#### Backend Deployment (e.g., Railway, Heroku)
1. Deploy the backend with these environment variables:
   ```env
   PORT=3001
   NODE_ENV=production
   CORS_ORIGINS=https://your-frontend-domain.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

#### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the frontend with these environment variables:
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com
   VITE_FRONTEND_URL=https://your-frontend-domain.com
   VITE_ADMIN_EMAIL=admin@yourcompany.com
   ```

### 3. Local Development

Use the default `.env` file for local development:
```env
VITE_FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Platform-Specific Instructions

### Heroku
1. Set environment variables in Heroku dashboard or CLI:
   ```bash
   heroku config:set VITE_FRONTEND_URL=https://your-app.herokuapp.com
   heroku config:set VITE_API_BASE_URL=https://your-app.herokuapp.com
   heroku config:set NODE_ENV=production
   ```

### Vercel (Frontend only)
1. Add environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your backend URL
   - `VITE_FRONTEND_URL`: Your Vercel app URL
   - `VITE_ADMIN_EMAIL`: Admin email address

### Netlify (Frontend only)
1. Add environment variables in Netlify dashboard:
   - `VITE_API_BASE_URL`: Your backend URL
   - `VITE_FRONTEND_URL`: Your Netlify app URL
   - `VITE_ADMIN_EMAIL`: Admin email address

### Railway
1. Add environment variables in Railway dashboard:
   ```
   PORT=3001
   NODE_ENV=production
   VITE_FRONTEND_URL=https://your-app.up.railway.app
   VITE_API_BASE_URL=https://your-app.up.railway.app
   ```

## Build Commands

### Development
```bash
npm run dev:full  # Runs both frontend and backend
```

### Production Build
```bash
npm run build     # Build frontend for production
npm run server    # Run backend server
```

## Important Notes

1. **VITE_ Prefix**: Client-side environment variables must have the `VITE_` prefix to be accessible in the frontend.

2. **CORS Configuration**: Make sure to update `CORS_ORIGINS` to include your frontend domain to avoid CORS errors.

3. **Email Configuration**: Update email credentials for production use. Consider using environment-specific email accounts.

4. **Admin Controls**: The admin email controls who can see certain UI elements like the "Clear All Signatures" button.

5. **Security**: Never commit `.env` files with real credentials to version control. Use `.env.example` as a template.

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGINS` includes your frontend domain
- Check that both HTTP and HTTPS variants are included if needed

### API Connection Issues
- Verify `VITE_API_BASE_URL` is correctly set
- Ensure the backend is accessible from the frontend domain

### Email Issues
- Verify email credentials are correct
- For Gmail, use App Passwords instead of regular passwords
- Check firewall settings for SMTP ports

### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Restart the development server after changing environment variables
- For production, verify environment variables are set in your hosting platform