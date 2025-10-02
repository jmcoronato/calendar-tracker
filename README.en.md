# CalendarTracker

**Full-stack application for daily activity management and tracking**

CalendarTracker is a web application that lets you create custom activities and mark on a calendar each day which ones you completed. It includes detailed statistics by periods and a light/dark theme system for a better user experience.

## 🚀 Main features

- ✅ **Activity management**: Create, edit, and delete custom activities
- 📅 **Interactive calendar**: Mark which activities you completed each day
- 📊 **Detailed statistics**: Visualize your progress by week or month
- 🌙 **Light/Dark theme**: Adaptive UI with preference persistence
- 📱 **Responsive design**: Works perfectly on desktop and mobile
- ⚡ **Real-time**: Reactive UI with instant updates

## 🛠️ Tech stack

### Frontend

- **React 18** with **TypeScript**
- **Vite** for development and build
- **CSS Modules** for scoped styles
- **ESLint** for code quality

### Backend

- **Node.js** with **Express**
- **TypeScript** for static typing
- **SQLite** with **better-sqlite3**
- **CORS** enabled for development

## 📋 Prerequisites

- **Node.js** 18 or higher
- **npm** 8 or higher

## 🚀 Quick start

### 1. Clone the repository

```bash
git clone https://github.com/tu-usuario/CalendarTracker.git
cd CalendarTracker
```

### 2. Set up the backend

Before starting the server, create a `.env` file in `backend/` with:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
SESSION_SECRET=change-me-in-prod
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

```bash
cd backend
npm install
npm run dev
```

The backend server will run at `http://localhost:3001`

### 3. Set up the frontend (in another terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend app will run at `http://localhost:5173`

### 4. All set!

Open your browser at `http://localhost:5173` and start using CalendarTracker.

## 📁 Project structure

```
CalendarTracker/
├─ backend/                 # REST API with Node.js + Express + SQLite
│  ├─ src/
│  │  ├─ db/               # Database configuration
│  │  ├─ routes/           # API endpoints
│  │  ├─ middleware/       # Custom middlewares
│  │  ├─ types/            # TypeScript types
│  │  └─ utils/            # Utilities
│  ├─ dist/                # Compiled code
│  └─ data.sqlite          # SQLite database
│
├─ frontend/               # SPA with React + TypeScript + Vite
│  ├─ src/
│  │  ├─ components/       # React components
│  │  ├─ context/          # Context providers
│  │  ├─ api.ts            # HTTP client
│  │  └─ types.ts          # Shared types
│  └─ dist/                # Production build
│
└─ README.md               # This file
```

## 🔧 Available scripts

### Backend

```bash
npm run dev     # Development server with auto-reload
npm run build   # Compile TypeScript
npm start       # Run in production
```

### Frontend

```bash
npm run dev      # Development server with HMR
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📡 API Endpoints

The REST API provides the following endpoints:

Note: except for `GET /api/health`, the activities, tracking, and state endpoints require an authenticated session (session cookie). Sign in with Google from the frontend.

### Activities

- `GET /api/activities` - List all activities
- `POST /api/activities` - Create a new activity
- `PUT /api/activities/:id` - Edit an activity
- `DELETE /api/activities/:id` - Delete an activity

### Tracking

- `GET /api/tracked` - Get tracking records
- `PUT /api/tracked/:dateKey` - Update a day's tracking

### State

- `GET /api/state` - Get the full application state
- `GET /api/health` - Server health check

For more details about each endpoint, see the [backend README](./backend/README.md).

## 🏗️ Production deployment

### Option 1: Traditional deployment

1. **Backend**:

   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   # Serve the contents of dist/ with your web server
   ```

### Option 2: Using Docker (coming soon)

```bash
# Build and run with docker-compose
docker-compose up --build
```

### Production proxy configuration

In production, configure your web server (Nginx, Apache, etc.) to:

- Serve the frontend from the root path (`/`)
- Proxy `/api/*` to the backend
- Handle SPA routing (fallback to `index.html`)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Troubleshooting

### Common errors

**Backend does not connect**

- Check that port 3001 is free
- Check write permissions for `data.sqlite`

**Frontend does not load**

- Make sure the backend is running on port 3001
- Check proxy configuration in `vite.config.ts`

**CORS errors**

- CORS is enabled by default in the backend
- Make sure URLs match between frontend and backend

**Authentication (401 Unauthorized)**

- Sign in from the frontend ("Sign in with Google" button)
- Make sure `FRONTEND_URL` in the backend `.env` matches the frontend origin

### Logs and debugging

```bash
# Backend - real-time logs
cd backend && npm run dev

# Frontend - logs in the browser console
# Open DevTools (F12) and check the console
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Code standards

- **Frontend**: Follow the configured ESLint rules
- **Backend**: Use TypeScript strict mode
- **Commits**: Use descriptive messages in Spanish
- **Documentation**: Update README when necessary

## 📝 Roadmap

- [ ] 🐳 Containerization with Docker
- [ ] 🔐 User authentication system
- [ ] 📊 Advanced charts and metrics
- [ ] 📱 Mobile app with React Native
- [ ] 🔄 Cloud synchronization
- [ ] 🎯 Goals and personalized targets
- [ ] 📈 Data export (CSV, JSON)
- [ ] 🌐 Internationalization (i18n)

## 📄 License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 👥 Authors

- **Your Name** - _Initial development_ - [your-username](https://github.com/tu-usuario)

## 🙏 Acknowledgments

- Thanks to the React and Node.js community for the amazing tools
- Inspired by habit-tracking and personal productivity methodologies

---

**Do you like the project?** ⭐ Give it a star on GitHub!

**Found a bug?** 🐛 [Report an issue](https://github.com/tu-usuario/CalendarTracker/issues)

**Got an idea?** 💡 [Start a discussion](https://github.com/tu-usuario/CalendarTracker/discussions)
