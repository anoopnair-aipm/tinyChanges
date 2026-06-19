import express, { Router } from 'express';
import { authMiddleware, AuthRequest, parentOnly, childOnly } from '../middleware/auth';
import { TaskModel } from '../models/Task';
import { UserModel } from '../models/User';
import { RewardModel } from '../models/Reward';

const router = Router();

// POST /api/tasks - Create task (parent only)
router.post('/', authMiddleware, parentOnly, async (req: AuthRequest, res: express.Response) => {
  try {
    const { childId, title, description, dueDate, rewardId, priority } = req.body;

    if (!childId || !title || !dueDate) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'childId, title, and dueDate are required',
        },
      });
    }

    // Verify child belongs to this parent
    const child = await UserModel.findById(childId);
    if (!child || !child.isChild || child.parentId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Child does not belong to this parent',
        },
      });
    }

    const task = await TaskModel.create(
      req.user!.userId,
      childId,
      title,
      new Date(dueDate),
      description,
      rewardId,
      priority || 'medium'
    );

    res.status(201).json({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
    });
  } catch (error: any) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create task',
      },
    });
  }
});

// GET /api/tasks - List tasks
router.get('/', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const { childId, status } = req.query;
    let tasks;

    if (req.user!.isChild) {
      // Child sees only their tasks
      tasks = await TaskModel.findByChildId(req.user!.userId, status as string | undefined);
    } else {
      // Parent sees all their children's tasks or specific child's tasks
      if (childId) {
        const child = await UserModel.findById(childId as string);
        if (!child || child.parentId !== req.user!.userId) {
          return res.status(403).json({
            error: {
              code: 'FORBIDDEN',
              message: 'Child does not belong to this parent',
            },
          });
        }
        tasks = await TaskModel.findByChildId(childId as string, status as string | undefined);
      } else {
        tasks = await TaskModel.findByParentId(req.user!.userId);
      }
    }

    res.json(
      tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        rewardId: task.rewardId,
        childId: task.childId,
        createdAt: task.createdAt,
      }))
    );
  } catch (error: any) {
    console.error('List tasks error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch tasks',
      },
    });
  }
});

// GET /api/tasks/:taskId - Get task details
router.get('/:taskId', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const task = await TaskModel.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    // Verify access
    if (req.user!.isChild && task.childId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this task',
        },
      });
    }

    if (!req.user!.isChild && task.parentId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this task',
        },
      });
    }

    res.json({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      rewardId: task.rewardId,
      childId: task.childId,
      createdAt: task.createdAt,
    });
  } catch (error: any) {
    console.error('Get task error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch task',
      },
    });
  }
});

// PATCH /api/tasks/:taskId - Update task (parent only)
router.patch('/:taskId', authMiddleware, parentOnly, async (req: AuthRequest, res: express.Response) => {
  try {
    const task = await TaskModel.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    if (task.parentId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this task',
        },
      });
    }

    const updated = await TaskModel.update(req.params.taskId, req.body);

    res.json({
      id: updated.id,
      title: updated.title,
      description: updated.description,
      dueDate: updated.dueDate,
      priority: updated.priority,
      status: updated.status,
      rewardId: updated.rewardId,
      createdAt: updated.createdAt,
    });
  } catch (error: any) {
    console.error('Update task error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update task',
      },
    });
  }
});

// DELETE /api/tasks/:taskId - Delete task (parent only)
router.delete('/:taskId', authMiddleware, parentOnly, async (req: AuthRequest, res: express.Response) => {
  try {
    const task = await TaskModel.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    if (task.parentId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this task',
        },
      });
    }

    await TaskModel.delete(req.params.taskId);
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete task error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete task',
      },
    });
  }
});

// POST /api/tasks/:taskId/complete - Mark task complete (child only)
router.post('/:taskId/complete', authMiddleware, childOnly, async (req: AuthRequest, res: express.Response) => {
  try {
    const { notes } = req.body;
    const task = await TaskModel.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    if (task.childId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this task',
        },
      });
    }

    // Check if deadline has passed
    const now = new Date();
    const isExpired = now > task.dueDate;

    if (isExpired) {
      // Mark as expired but don't award reward
      await TaskModel.update(req.params.taskId, { status: 'expired' });
      return res.status(400).json({
        error: {
          code: 'TASK_EXPIRED',
          message: 'Task deadline has passed. No reward earned.',
        },
      });
    }

    // Mark as completed
    await TaskModel.markCompleted(req.params.taskId, req.user!.userId, notes);

    // Award reward if task has one
    let rewardEarned = null;
    if (task.rewardId) {
      const reward = await RewardModel.findById(task.rewardId);
      if (reward) {
        await RewardModel.addBalance(req.user!.userId, task.rewardId, reward.pointsValue);
        rewardEarned = {
          id: reward.id,
          name: reward.name,
          pointsValue: reward.pointsValue,
        };
      }
    }

    res.json({
      taskId: task.id,
      completedAt: new Date(),
      rewardEarned,
    });
  } catch (error: any) {
    console.error('Complete task error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to complete task',
      },
    });
  }
});

export default router;
