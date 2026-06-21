# API Documentation

**Base URL (production)**: `https://tinychanges-api-production.up.railway.app`
**Base URL (local dev)**: `http://localhost:5000`

## Authentication

Protected endpoints require a JWT issued by the backend after Google OAuth login. Pass it as a Bearer token:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained from `POST /api/auth/login` or `POST /api/auth/child-login`.

---

## Public Endpoints

### GET /api/health

Health check. Returns server and database status.

**Response (200)**:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-20T19:58:01.545Z"
}
```

---

### GET /api

Returns API info.

**Response (200)**: API description object.

---

### POST /api/auth/login

Parent Google OAuth login. Exchange the authorization code received from Google for a JWT.

**Request**:
```json
{
  "code": "authorization_code_from_google"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "bbba15cb-624f-446b-bf7d-6ec09ed3f36b",
    "email": "parent@example.com",
    "name": "Jane Doe",
    "isChild": false
  }
}
```

---

### POST /api/auth/child-login

Child Google OAuth login. Same flow as parent login but creates/fetches a child account.

**Request**:
```json
{
  "code": "authorization_code_from_google"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "child@example.com",
    "name": "Tommy",
    "isChild": true
  }
}
```

---

## Auth Endpoints (requires JWT)

### GET /api/auth/profile

Returns the profile of the currently authenticated user.

**Response (200)**:
```json
{
  "id": "uuid",
  "email": "parent@example.com",
  "name": "Jane Doe",
  "profilePictureUrl": "https://lh3.googleusercontent.com/...",
  "isChild": false,
  "createdAt": "2026-06-20T10:00:00.000Z"
}
```

---

### POST /api/auth/add-child

Add a child account to the parent's account. The child must first sign in via `POST /api/auth/child-login` so their account exists.

**Request**:
```json
{
  "name": "Tommy",
  "email": "tommy@example.com"
}
```

**Response (201)**: Child user object.

---

### GET /api/auth/children

List all children linked to the authenticated parent.

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "name": "Tommy",
    "email": "tommy@example.com",
    "profilePictureUrl": "https://..."
  }
]
```

---

## Task Endpoints (requires JWT)

### POST /api/tasks

Create a new task. Parent only.

**Request**:
```json
{
  "title": "Clean your room",
  "description": "Tidy up toys and organize books",
  "childId": "uuid",
  "dueDate": "2026-06-30T18:00:00Z",
  "rewardId": "uuid",
  "priority": "high"
}
```

- `priority`: `"low"`, `"medium"`, or `"high"` (default: `"medium"`)
- `rewardId`: optional — links a reward to this task
- `description`: optional

**Response (201)**: Task object.

---

### GET /api/tasks

List tasks. Parents see all tasks for their children. Children see only their own tasks.

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "title": "Clean your room",
    "description": "Tidy up toys and organize books",
    "childId": "uuid",
    "parentId": "uuid",
    "dueDate": "2026-06-30T18:00:00Z",
    "priority": "high",
    "status": "pending",
    "rewardId": "uuid",
    "createdAt": "2026-06-20T10:00:00.000Z"
  }
]
```

**Task statuses**: `pending`, `completed`, `expired`

---

### GET /api/tasks/:taskId

Get a single task by ID.

**Response (200)**: Task object (same shape as above).

---

### PATCH /api/tasks/:taskId

Update a task. Parent only.

**Request** (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2026-07-01T18:00:00Z",
  "priority": "medium",
  "rewardId": "uuid"
}
```

**Response (200)**: Updated task object.

---

### DELETE /api/tasks/:taskId

Delete a task. Parent only.

**Response (204)**: No content.

---

### POST /api/tasks/:taskId/complete

Mark a task as complete. Child only.

**Request**:
```json
{
  "notes": "I cleaned my room!"
}
```

- `notes`: optional

**Response (200)**:
```json
{
  "taskId": "uuid",
  "completedAt": "2026-06-20T14:30:00Z",
  "rewardEarned": {
    "id": "uuid",
    "name": "Gold Star",
    "pointsValue": 10
  }
}
```

`rewardEarned` is `null` if no reward was linked to the task.

---

## Reward Endpoints (requires JWT)

### POST /api/rewards

Create a new reward. Parent only.

**Request**:
```json
{
  "name": "Extra screen time",
  "description": "30 minutes of gaming",
  "pointsValue": 15,
  "icon": "gamepad",
  "color": "#FF6B6B"
}
```

- `description`, `icon`, `color`: optional
- `pointsValue`: positive integer

**Response (201)**: Reward object.

---

### GET /api/rewards

List rewards for the authenticated parent's account.

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "name": "Extra screen time",
    "description": "30 minutes of gaming",
    "pointsValue": 15,
    "icon": "gamepad",
    "color": "#FF6B6B",
    "parentId": "uuid",
    "createdAt": "2026-06-20T10:00:00.000Z"
  }
]
```

---

### GET /api/rewards/:rewardId

Get a single reward by ID.

**Response (200)**: Reward object.

---

### PATCH /api/rewards/:rewardId

Update a reward. Parent only.

**Request** (all fields optional):
```json
{
  "name": "Updated name",
  "description": "Updated description",
  "pointsValue": 20,
  "icon": "star",
  "color": "#FFD700"
}
```

**Response (200)**: Updated reward object.

---

### DELETE /api/rewards/:rewardId

Delete a reward. Parent only.

**Response (204)**: No content.

---

### GET /api/rewards/balance/:childId

Get a child's current reward balance. Accessible by the parent of that child.

**Response (200)**:
```json
[
  {
    "rewardId": "uuid",
    "name": "Gold Star",
    "balance": 5,
    "icon": "star",
    "color": "#FFD700"
  }
]
```

---

### POST /api/rewards/:rewardId/redeem

Redeem a reward. Child only. The child must have sufficient balance.

**Request**:
```json
{}
```

No body required (quantity defaults to 1).

**Response (200)**:
```json
{
  "redemptionId": "uuid",
  "redeemedAt": "2026-06-20T14:35:00Z",
  "remainingBalance": 4
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Description of what went wrong"
}
```

**Common HTTP status codes**:

| Code | Meaning |
|------|---------|
| 400 | Bad Request — missing or invalid fields |
| 401 | Unauthorized — missing, invalid, or expired JWT |
| 403 | Forbidden — authenticated but not allowed (e.g., child trying to create a task) |
| 404 | Not Found — resource does not exist |
| 409 | Conflict — e.g., duplicate resource |
| 500 | Internal Server Error |

---

## Frontend Routes (for reference)

These are Next.js app router routes on the frontend, not backend API routes.

| Route | Description |
|-------|-------------|
| `/` | Home / landing page |
| `/login` | Parent Google OAuth login |
| `/login/child` | Child Google OAuth login |
| `/api/auth/callback` | OAuth callback handler (receives `?code=` from Google) |
| `/dashboard/parent` | Parent dashboard |
| `/dashboard/parent/child/[childId]/tasks` | View a child's tasks (parent view) |
| `/dashboard/parent/child/[childId]/rewards` | View a child's rewards (parent view) |
| `/dashboard/child` | Child dashboard |
| `/dashboard/child/tasks` | Child's task list |
| `/dashboard/child/rewards` | Child's reward view |
