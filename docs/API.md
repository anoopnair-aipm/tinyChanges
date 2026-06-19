# API Documentation

Base URL: `https://api.tinychanges.com` (production) or `http://localhost:5000` (development)

## Authentication

All endpoints require a Bearer token obtained from Google OAuth. Include in request headers:

```
Authorization: Bearer {google_oauth_token}
```

## Endpoints

### Auth Endpoints

#### POST /api/auth/login
Google OAuth login callback.

**Request**:
```json
{
  "code": "authorization_code_from_google"
}
```

**Response** (200):
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "isChild": false
  }
}
```

#### POST /api/auth/logout
Logout current user.

### User Endpoints

#### GET /api/users/profile
Get current user profile.

**Response** (200):
```json
{
  "id": "uuid",
  "email": "parent@example.com",
  "name": "Jane Doe",
  "profilePictureUrl": "https://...",
  "isChild": false,
  "children": [
    {
      "id": "uuid",
      "name": "Child Name",
      "email": "child@example.com"
    }
  ]
}
```

#### POST /api/users/children
Add a child to parent's account.

**Request**:
```json
{
  "name": "Tommy",
  "childEmail": "tommy@example.com"
}
```

**Response** (201): Child object

#### GET /api/users/children
Get all children of current parent.

**Response** (200): Array of child objects

#### DELETE /api/users/children/{childId}
Remove a child from parent's account.

### Task Endpoints

#### POST /api/tasks
Create a new task (parent only).

**Request**:
```json
{
  "childId": "uuid",
  "title": "Clean your room",
  "description": "Tidy up toys and organize books",
  "dueDate": "2026-06-30T18:00:00Z",
  "rewardId": "uuid",
  "priority": "high"
}
```

**Response** (201): Task object

#### GET /api/tasks
List tasks for current user.

**Query parameters**:
- `childId` (parent): filter by child
- `status` (both): `pending`, `completed`, `expired`
- `limit` (both): default 20, max 100
- `offset` (both): default 0

**Response** (200): Array of task objects

#### GET /api/tasks/{taskId}
Get single task details.

**Response** (200): Task object with completion history

#### PATCH /api/tasks/{taskId}
Update a task (parent only).

**Request**:
```json
{
  "title": "Updated title",
  "dueDate": "2026-07-01T18:00:00Z",
  "priority": "medium"
}
```

**Response** (200): Updated task object

#### DELETE /api/tasks/{taskId}
Delete a task (parent only).

**Response** (204): No content

#### POST /api/tasks/{taskId}/complete
Mark task as complete (child only).

**Request**:
```json
{
  "notes": "I cleaned my room!"
}
```

**Response** (200):
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

### Reward Endpoints

#### POST /api/rewards
Create a new reward (parent only).

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

**Response** (201): Reward object

#### GET /api/rewards
List rewards for current user's account.

**Response** (200): Array of reward objects

#### PATCH /api/rewards/{rewardId}
Update a reward (parent only).

**Request**:
```json
{
  "name": "Updated reward name",
  "pointsValue": 20
}
```

**Response** (200): Updated reward object

#### DELETE /api/rewards/{rewardId}
Delete a reward (parent only).

**Response** (204): No content

#### GET /api/rewards/balance
Get reward balance for current user (child only).

**Response** (200):
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

#### POST /api/rewards/{rewardId}/redeem
Redeem a reward (child only).

**Request**:
```json
{
  "quantity": 1,
  "notes": "Redeemed for extra playtime"
}
```

**Response** (200):
```json
{
  "redemptionId": "uuid",
  "redeemedAt": "2026-06-20T14:35:00Z",
  "remainingBalance": 4
}
```

### Notification Endpoints

#### GET /api/notifications
Get notifications for current user.

**Query parameters**:
- `unreadOnly` (both): default false
- `limit` (both): default 20

**Response** (200): Array of notification objects

#### PATCH /api/notifications/{notificationId}
Mark notification as read.

**Response** (200): Updated notification object

#### DELETE /api/notifications/{notificationId}
Delete a notification.

**Response** (204): No content

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Task not found",
    "details": {}
  }
}
```

**Common Status Codes**:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per minute per IP address

Headers in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1624190400
```
