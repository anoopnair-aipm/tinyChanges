# Database Schema

## Tables Overview

### users
Primary table for both parents and children.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_picture_url TEXT,
  is_child BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Relationships**:
- `parent_id` links child accounts to their parent
- `is_child` flag differentiates parent/child accounts

### tasks
Task assignments created by parents for their children.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  reward_id UUID REFERENCES rewards(id) ON DELETE SET NULL,
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_child_belongs_to_parent 
    CHECK ((SELECT parent_id FROM users WHERE id = child_id) = parent_id)
);
```

**Statuses**: `pending`, `completed`, `expired`

### task_completions
Record of task completions with timestamps.

```sql
CREATE TABLE task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### rewards
Parent-managed reward list.

```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_value INT NOT NULL,
  icon VARCHAR(100),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### reward_balances
Tracks earned rewards per child.

```sql
CREATE TABLE reward_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  balance INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(child_id, reward_id)
);
```

### reward_redemptions
Record of reward redemptions.

```sql
CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  redeemed_at TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### notifications
In-app notifications for parents and children.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  related_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  related_reward_id UUID REFERENCES rewards(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Types**: `task_completed`, `reward_earned`, `deadline_approaching`, `reward_redeemed`

## Indexes for Performance

```sql
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_parent_id ON users(parent_id);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_id);
CREATE INDEX idx_tasks_child_id ON tasks(child_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_completions_child_id ON task_completions(child_id);
CREATE INDEX idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_rewards_parent_id ON rewards(parent_id);
CREATE INDEX idx_reward_balances_child_id ON reward_balances(child_id);
CREATE INDEX idx_reward_redemptions_child_id ON reward_redemptions(child_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## Data Constraints & Validation

1. **Parent-Child Relationship**: Tasks can only be assigned to direct children
2. **Due Date**: Must be in the future when created
3. **Reward Points**: Must be positive integers
4. **Redemption**: Child must have earned reward before redeeming
5. **Completion**: Tasks can only be marked complete after creation, before expiry

## Migrations

Database migrations will be version-controlled in the `backend/migrations/` directory using a migration tool (e.g., Knex.js, TypeORM).

```
backend/
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_add_indexes.sql
    └── 003_add_notifications.sql
```
