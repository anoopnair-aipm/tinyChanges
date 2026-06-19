import express, { Router } from 'express';
import { authMiddleware, AuthRequest, parentOnly, childOnly } from '../middleware/auth';
import { RewardModel } from '../models/Reward';
import { UserModel } from '../models/User';

const router = Router();

// POST /api/rewards - Create reward (parent only)
router.post('/', authMiddleware, parentOnly, async (req: AuthRequest, res: express.Response) => {
  try {
    const { name, description, pointsValue } = req.body;

    if (!name || !pointsValue) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'name and pointsValue are required',
        },
      });
    }

    const reward = await RewardModel.create(
      req.user!.userId,
      name,
      pointsValue,
      description
    );

    res.status(201).json({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      pointsValue: reward.pointsValue,
      createdAt: reward.createdAt,
    });
  } catch (error: any) {
    console.error('Create reward error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create reward',
      },
    });
  }
});

// GET /api/rewards - List rewards
router.get('/', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    let rewards;

    if (req.user!.isChild) {
      // Child sees rewards they can redeem (all parent rewards)
      // TODO: In future, restrict to rewards assigned to specific child
      rewards = await RewardModel.findByParentId(req.user!.userId);
    } else {
      // Parent sees all their rewards
      rewards = await RewardModel.findByParentId(req.user!.userId);
    }

    res.json(
      rewards.map((reward) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        pointsValue: reward.pointsValue,
        createdAt: reward.createdAt,
      }))
    );
  } catch (error: any) {
    console.error('List rewards error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch rewards',
      },
    });
  }
});

// GET /api/rewards/:rewardId - Get reward details
router.get('/:rewardId', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const reward = await RewardModel.findById(req.params.rewardId);

    if (!reward) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Reward not found',
        },
      });
    }

    // Verify parent access
    if (!req.user!.isChild && reward.parentId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this reward',
        },
      });
    }

    res.json({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      pointsValue: reward.pointsValue,
      createdAt: reward.createdAt,
    });
  } catch (error: any) {
    console.error('Get reward error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch reward',
      },
    });
  }
});

// PATCH /api/rewards/:rewardId - Update reward (parent only)
router.patch('/:rewardId', authMiddleware, parentOnly, async (req: AuthRequest, res: express.Response) => {
  try {
    const reward = await RewardModel.findById(req.params.rewardId);

    if (!reward) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Reward not found',
        },
      });
    }

    if (reward.parentId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this reward',
        },
      });
    }

    const updated = await RewardModel.update(req.params.rewardId, req.body);

    res.json({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      pointsValue: updated.pointsValue,
      createdAt: updated.createdAt,
    });
  } catch (error: any) {
    console.error('Update reward error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update reward',
      },
    });
  }
});

// DELETE /api/rewards/:rewardId - Delete reward (parent only)
router.delete('/:rewardId', authMiddleware, parentOnly, async (req: AuthRequest, res: express.Response) => {
  try {
    const reward = await RewardModel.findById(req.params.rewardId);

    if (!reward) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Reward not found',
        },
      });
    }

    if (reward.parentId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this reward',
        },
      });
    }

    await RewardModel.delete(req.params.rewardId);
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete reward error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete reward',
      },
    });
  }
});

// GET /api/rewards/balance/:childId - Get child's reward balance
router.get('/balance/:childId', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const childId = req.params.childId;
    const child = await UserModel.findById(childId);

    if (!child || !child.isChild) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Child not found',
        },
      });
    }

    // Verify access
    if (req.user!.isChild && req.user!.userId !== childId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have access to this balance',
        },
      });
    }

    if (!req.user!.isChild && child.parentId !== req.user!.userId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Child does not belong to this parent',
        },
      });
    }

    const balances = await RewardModel.getChildBalances(childId);

    res.json({
      childId,
      balances: balances.map((b: any) => ({
        rewardId: b.reward_id,
        rewardName: b.name,
        pointsValue: b.points_value,
        balance: b.balance,
      })),
    });
  } catch (error: any) {
    console.error('Get balance error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch balance',
      },
    });
  }
});

// POST /api/rewards/:rewardId/redeem - Redeem reward (child only)
router.post('/:rewardId/redeem', authMiddleware, childOnly, async (req: AuthRequest, res: express.Response) => {
  try {
    const reward = await RewardModel.findById(req.params.rewardId);

    if (!reward) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Reward not found',
        },
      });
    }

    // Check balance
    const balance = await RewardModel.getBalance(req.user!.userId, req.params.rewardId);

    if (balance < 1) {
      return res.status(400).json({
        error: {
          code: 'INSUFFICIENT_BALANCE',
          message: 'You do not have enough rewards to redeem',
        },
      });
    }

    const remainingBalance = await RewardModel.subtractBalance(
      req.user!.userId,
      req.params.rewardId,
      1
    );

    res.json({
      rewardId: reward.id,
      rewardName: reward.name,
      redeemedAt: new Date(),
      remainingBalance,
    });
  } catch (error: any) {
    console.error('Redeem reward error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to redeem reward',
      },
    });
  }
});

export default router;
