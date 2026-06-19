-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_picture_url TEXT,
  is_child BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_parent_child CHECK (
    (is_child = false AND parent_id IS NULL) OR
    (is_child = true AND parent_id IS NOT NULL)
  )
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  reward_id UUID,
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create task_completions table
CREATE TABLE IF NOT EXISTS task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_value INT NOT NULL CHECK (points_value > 0),
  icon VARCHAR(100),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reward_balances table
CREATE TABLE IF NOT EXISTS reward_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  balance INT DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(child_id, reward_id)
);

-- Create reward_redemptions table
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1 CHECK (quantity > 0),
  redeemed_at TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
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

-- Create indexes for better query performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_parent_id ON users(parent_id);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_id);
CREATE INDEX idx_tasks_child_id ON tasks(child_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_task_completions_child_id ON task_completions(child_id);
CREATE INDEX idx_task_completions_task_id ON task_completions(task_id);
CREATE INDEX idx_rewards_parent_id ON rewards(parent_id);
CREATE INDEX idx_reward_balances_child_id ON reward_balances(child_id);
CREATE INDEX idx_reward_balances_reward_id ON reward_balances(reward_id);
CREATE INDEX idx_reward_redemptions_child_id ON reward_redemptions(child_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
