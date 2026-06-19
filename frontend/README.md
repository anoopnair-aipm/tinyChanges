# tinyChanges Web App

Next.js frontend for the tinyChanges platform.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

App runs on `http://localhost:3000`

## Development

```bash
npm run lint        # Check code style
npm run lint:fix    # Auto-fix issues
npm run format      # Format code
npm run type-check  # Check TypeScript types
npm run test        # Run tests
```

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
app/
├── (auth)/         # Authentication pages
├── (dashboard)/    # Protected dashboard pages
├── api/            # API routes
├── layout.tsx      # Root layout
└── page.tsx        # Home page

components/
├── ui/             # Reusable UI components
├── auth/           # Auth components
├── tasks/          # Task components
└── rewards/        # Reward components

lib/
├── api.ts          # API client
├── store.ts        # Zustand store
└── hooks/          # Custom hooks

public/            # Static assets
```

## Features

- 🔐 Google OAuth authentication
- 👨‍👩‍👧 Parent and child accounts
- ✅ Task management
- 🎁 Reward system
- 📱 Responsive design
- 🎨 Tailwind CSS styling

## Technologies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)
