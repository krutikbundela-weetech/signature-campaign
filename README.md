# Employee Trip Signature Campaign

A fun and interactive web application for collecting employee signatures for a company trip request. Built with React, Node.js, and Express.

## Features

- 🖊️ Digital signature collection
- 📊 Real-time progress tracking
- 📧 Automated email notifications to HR/Board
- 👥 Role-based access (Employees, HR, Board Directors)
- 🎨 Beautiful, responsive UI with animations
- 🔒 Employee authentication system

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Run the interactive environment setup:
```bash
npm run setup-env
```

Or manually copy and configure:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run the Application
```bash
# Development (runs both frontend and backend)
npm run dev:full

# Or run separately
npm run server  # Backend only
npm run dev     # Frontend only
```

## Environment Configuration

The application uses environment variables for different deployment scenarios:

### Key Variables

- `VITE_FRONTEND_URL` - Frontend application URL
- `VITE_API_BASE_URL` - Backend API URL  
- `CORS_ORIGINS` - Allowed origins for CORS
- `EMAIL_USER` / `EMAIL_PASS` - Email credentials for notifications
- `VITE_ADMIN_EMAIL` - Admin email for special controls

### Environment Files

- `.env` - Development configuration
- `.env.production` - Production configuration
- `.env.example` - Template with all variables

## Deployment

### Same Platform (e.g., Heroku, Railway)
Deploy frontend and backend together:

```bash
# Set environment variables
VITE_FRONTEND_URL=https://your-app.herokuapp.com
VITE_API_BASE_URL=https://your-app.herokuapp.com
CORS_ORIGINS=https://your-app.herokuapp.com
```

### Separate Platforms

#### Backend (e.g., Railway, Heroku)
```bash
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://your-frontend-domain.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Frontend (e.g., Vercel, Netlify)
```bash
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_FRONTEND_URL=https://your-frontend-domain.com
VITE_ADMIN_EMAIL=admin@yourcompany.com
```

## Project Structure

```
signature-campaign/
├── src/
│   ├── components/          # React components
│   ├── utils/              # Utility functions
│   ├── config/             # Configuration files
│   └── App.jsx             # Main application
├─��� public/
│   ├── employees.json      # Employee data
│   └── SavedSignatures/    # Stored signatures
├── scripts/
│   └── setup-env.js        # Environment setup script
├── server.js               # Express backend
├── .env.example            # Environment template
└── DEPLOYMENT.md           # Detailed deployment guide
```

## Configuration

### Employee Data
Edit `public/employees.json` to add your employees and HR/Board members:

```json
{
  "employees": [
    {"name": "John Doe", "email": "john@company.com"}
  ],
  "hrBoard": {
    "hr": [
      {"name": "HR Manager", "email": "hr@company.com"}
    ],
    "board": [
      {"name": "Board Member", "email": "board@company.com"}
    ]
  }
}
```

### Email Setup
For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

## Scripts

- `npm run dev:full` - Run both frontend and backend
- `npm run dev` - Frontend development server
- `npm run server` - Backend server only
- `npm run build` - Build for production
- `npm run setup-env` - Interactive environment setup

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGINS` includes your frontend domain
- Check both HTTP and HTTPS variants

### API Connection Issues
- Verify `VITE_API_BASE_URL` is correct
- Ensure backend is accessible from frontend

### Email Issues
- Use App Passwords for Gmail
- Check SMTP settings and firewall

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed platform-specific instructions.