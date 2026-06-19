// User types
export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  isChild: boolean;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task types
export interface Task {
  id: string;
  parentId: string;
  childId: string;
  title: string;
  description?: string;
  dueDate: Date;
  rewardId?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  childId: string;
  completedAt: Date;
  notes?: string;
  createdAt: Date;
}

// Reward types
export interface Reward {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  pointsValue: number;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RewardBalance {
  id: string;
  childId: string;
  rewardId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RewardRedemption {
  id: string;
  childId: string;
  rewardId: string;
  quantity: number;
  redeemedAt: Date;
  notes?: string;
  createdAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'task_completed' | 'reward_earned' | 'deadline_approaching' | 'reward_redeemed';
  title: string;
  message?: string;
  relatedTaskId?: string;
  relatedRewardId?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response types
export interface AuthPayload {
  code: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  isChild: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
