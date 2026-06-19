# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Browser (Parent/Child Web App - Next.js)                   │
│  - Google OAuth Login                                       │
│  - Responsive UI for mobile/tablet/desktop                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     API Layer                                │
├─────────────────────────────────────────────────────────────┤
│  Node.js/Express Backend                                    │
│  - RESTful API endpoints                                    │
│  - Authentication middleware (Google OAuth verification)    │
│  - Business logic (task, reward, user management)           │
│  - Real-time notifications (WebSocket)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Connection pooling
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Data Layer                                  │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                        │
│  - Users (Parent & Child)                                   │
│  - Tasks                                                    │
│  - Rewards                                                  │
│  - Task Completions & Reward Redemptions                    │
└─────────────────────────────────────────────────────────────┘
```

## Component Interaction

### Authentication Flow
1. User (Parent/Child) clicks "Login with Google"
2. Redirected to Google OAuth consent screen
3. Google returns authorization code
4. Backend validates code with Google servers
5. Backend creates/updates user in database
6. Session token issued to client
7. User redirected to dashboard

### Task Completion Flow
1. Child views task in UI
2. Clicks "Mark as Complete"
3. Frontend sends request to `/api/tasks/{id}/complete`
4. Backend verifies:
   - Task exists and belongs to child's parent
   - Deadline not exceeded
5. Creates `TaskCompletion` record
6. Calculates rewards (if applicable)
7. Updates child's reward balance
8. Returns updated task status to frontend
9. Child sees success message and updated reward display

### Reward Redemption Flow
1. Child views earned reward
2. Clicks "Redeem"
3. Frontend sends request to `/api/rewards/{id}/redeem`
4. Backend verifies:
   - Child has earned reward
   - Reward not already redeemed
5. Creates `RedemptionRecord`
6. Deducts from reward balance
7. Parent receives notification
8. Returns success to frontend

## Database Relationships

```
Parent (User)
├── Children (User [child=true])
│   ├── Tasks (created by parent)
│   ├── TaskCompletions
│   └── RewardRedemptions
├── Rewards (parent-created reward list)
└── Notifications
```

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│         AWS / Cloud Provider             │
├──────────────────────────────────────────┤
│  Load Balancer (ALB)                     │
│       ↓                                  │
│  ECS Cluster / Kubernetes                │
│  ├── Frontend Container (Next.js build)  │
│  └── Backend Container (Node.js)         │
│       ↓                                  │
│  RDS PostgreSQL                          │
│       ↓                                  │
│  S3 (static assets, backups)             │
└──────────────────────────────────────────┘
```

## Security Layers

1. **Transport**: HTTPS/TLS encryption
2. **Authentication**: Google OAuth 2.0 (no password storage)
3. **Authorization**: Role-based (parent vs child)
4. **API**: CORS, rate limiting, input validation
5. **Database**: Parameterized queries (SQL injection prevention)
6. **Secrets**: Environment variables, secrets manager

## Scalability Considerations

- **Database**: Connection pooling, read replicas for analytics
- **API**: Stateless design, horizontal scaling via containers
- **Frontend**: CDN for static assets, service worker caching
- **Caching**: Redis for session/data caching (future enhancement)
- **Monitoring**: CloudWatch, DataDog for performance tracking
