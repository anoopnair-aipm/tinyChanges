# tinyChanges 🎯

A parent-child task management platform where parents assign tasks with rewards, and children track progress and earn achievements.

**Target Age**: 5-12 years old  
**Status**: MVP Development

## 🎮 Features (MVP)

### Parent Features
- **Profile Management**: Create account with Google OAuth
- **Child Management**: Add multiple children to their account
- **Task Management**: Create, edit, delete tasks with deadlines
- **Reward System**: Create and manage a custom reward list
- **Dashboard**: View child progress, task completion status, reward balances
- **Notifications**: Real-time updates on child activities

### Child Features
- **Profile Management**: Google OAuth login
- **Task View**: See assigned tasks with deadlines and rewards
- **Task Completion**: Mark tasks as complete with optional notes
- **Reward Tracking**: View earned rewards and redemption status
- **Gamification**: Visual progress indicators and achievement badges

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14+ (TypeScript, Tailwind CSS) |
| **Backend** | Node.js/Express (TypeScript) |
| **Database** | PostgreSQL |
| **Authentication** | Google OAuth 2.0 |
| **Deployment** | Docker + AWS/Vercel |

## 📁 Project Structure

```
tinyChanges/
├── frontend/               # Next.js application
│   ├── app/              # App router pages
│   ├── components/       # Reusable React components
│   ├── lib/             # Utilities and helpers
│   └── public/          # Static assets
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── docker-compose.yml    # Local development setup
├── .github/              # GitHub Actions workflows
├── docs/                 # Architecture and guides
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for local development)
- Google OAuth credentials

### Development Setup

```bash
# Clone the repo
git clone https://github.com/anoopnair-aipm/tinyChanges.git
cd tinyChanges

# Start development stack
docker-compose up -d

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` for the frontend and `http://localhost:5000` for the API.

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE.md)
- [API Documentation](./docs/API.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🔐 Security & Privacy

- All credentials stored securely (environment variables)
- Google OAuth for authentication (no password storage)
- Parental controls ensure child data privacy
- GDPR-compliant data handling

## 📝 License

MIT License - See LICENSE file

## 👥 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
