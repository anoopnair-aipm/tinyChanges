# Database Schema

PostgreSQL is used in production (managed by Railway). The schema is applied automatically at server startup — no manual migration commands are needed.

## Auto-Migration

The backend's `src/index.ts` runs schema SQL against the database before the Express server begins accepting requests. All `CREATE TABLE` statements use `IF NOT EXISTS`, so they are safe to run on every boot. This means:

- On a fresh Railway PostgreSQL instance, the schema is created on first deploy
- On subsequent deploys, existing tables are left intact
- No `npm run db:migrate` command is needed in production

For local development, the same auto-migration runs when you start the backend with `npm run dev`.

---

## Tables

### users

Primary table for both parent and child accounts.

```sql
CREATE TABLE IF NOT EXISTS users (
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

**Key fields**:
- `is_child`: `false` for parents, `true` for children
- `parent_id`: `NULL` for parents; references the parent's `id` for children

---

### tasks

Task assignments created by parents for their children.

```sql
CREATE TABLE IF NOT EXISTS tasks (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**priority values**: `low`, `medium`, `high`
**status values**: `pending`, `completed`, `expired`

---

### task_completions

One record per task completion.

```sql
CREATE TABLE IF NOT EXISTS task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### rewards

Parent-managed list of rewards that can be earned by children.

```sql
CREATE TABLE IF NOT EXISTS rewards (
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

---

### reward_balances

Tracks how many of each reward each child has earned.

```sql
CREATE TABLE IF NOT EXISTS reward_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  balance INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(child_id, reward_id)
);
```

---

### reward_redemptions

Audit log of every time a child redeems a reward.

```sql
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  redeemed_at TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### notifications

In-app notifications for parents and children.

```sql
CREATE TABLE IF NOT EXISTS notifications (
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

**type values**: `task_completed`, `reward_earned`, `deadline_approaching`, `reward_redeemed`

---

## Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON users(parent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_child_id ON tasks(child_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_completions_child_id ON task_completions(child_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX IF NOT EXISTS idx_rewards_parent_id ON rewards(parent_id);
CREATE INDEX IF NOT EXISTS idx_reward_balances_child_id ON reward_balances(child_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_child_id ON reward_redemptions(child_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
```

---

## Data Constraints

1. A task's `child_id` must reference a child whose `parent_id` matches the task's `parent_id` (enforced in application logic)
2. `rewards.points_value` must be a positive integer (enforced at the controller layer)
3. A child can only redeem a reward if their `reward_balances.balance` is greater than zero
4. Tasks can only be marked complete when their `status` is `pending`

---

## Entity Relationships

```
users (parent, is_child=false)
└── users (children, is_child=true, parent_id=parent.id)
    ├── tasks (child_id → child, parent_id → parent)
    │   └── task_completions (task_id → task, child_id → child)
    ├── reward_balances (child_id → child, reward_id → reward)
    └── reward_redemptions (child_id → child, reward_id → reward)

users (parent)
└── rewards (parent_id → parent)
    └── tasks (reward_id → reward, optional link)

users (any)
└── notifications (user_id → user)
```
