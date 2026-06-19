# tinyChanges API Backend

Node.js/Express backend for the tinyChanges platform.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

## Development

```bash
npm run lint        # Check code style
npm run lint:fix    # Auto-fix issues
npm run format      # Format code
npm run test        # Run tests
npm run test:watch  # Watch mode
```

## Project Structure

```
src/
├── controllers/     # Route handlers
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Express middleware
├── services/        # Business logic
├── types/           # TypeScript types
├── database/        # Database utilities
└── index.ts         # Entry point
```

## API Documentation

See [docs/API.md](../docs/API.md) for complete API documentation.

## Database

PostgreSQL is required. For local development, use Docker Compose:

```bash
docker-compose up postgres
```

Migrations:
```bash
npm run db:migrate       # Apply migrations
npm run db:rollback     # Revert last migration
npm run db:migrate:create -- --name migration_name
```
