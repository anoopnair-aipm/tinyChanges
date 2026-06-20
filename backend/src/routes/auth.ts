import express, { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';

const router = Router();

interface LoginRequest {
  code: string;
}

interface AddChildRequest {
  name: string;
  email: string;
}

// POST /api/auth/login - Google OAuth login
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.body as LoginRequest;

    if (!code) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Authorization code is required',
        },
      });
    }

    // Verify Google token
    const googleInfo = await AuthService.verifyGoogleToken(code);

    // Authenticate or create user
    const user = await AuthService.authenticateOrCreateUser(googleInfo);

    // Generate JWT token
    const token = AuthService.generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePictureUrl: user.profilePictureUrl,
        isChild: user.isChild,
      },
    });
  } catch (error: any) {
    const googleError = error?.response?.data;
    console.error('Login error - Google response:', JSON.stringify(googleError));
    console.error('Login error - Full:', error?.message);
    res.status(401).json({
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: googleError?.error_description || googleError?.error || 'Failed to authenticate with Google',
      },
    });
  }
});

// POST /api/auth/child-login - Child Google OAuth login
router.post('/child-login', async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.body as LoginRequest;

    if (!code) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Authorization code is required',
        },
      });
    }

    // Verify Google token
    const googleInfo = await AuthService.verifyGoogleToken(code);

    // Find child account by email
    const user = await UserModel.findByEmail(googleInfo.email);

    if (!user || !user.isChild) {
      return res.status(401).json({
        error: {
          code: 'CHILD_NOT_FOUND',
          message: 'Child account not found. Ask your parent to add you.',
        },
      });
    }

    // Update Google ID if not set
    if (!user.googleId.startsWith('child_')) {
      await UserModel.update(user.id, {
        profilePictureUrl: googleInfo.picture,
        name: googleInfo.name,
      });
    }

    // Generate JWT token
    const token = AuthService.generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePictureUrl: user.profilePictureUrl,
        isChild: user.isChild,
        parentId: user.parentId,
      },
    });
  } catch (error) {
    console.error('Child login error:', error);
    res.status(401).json({
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: 'Failed to authenticate child',
      },
    });
  }
});

// GET /api/auth/profile - Get current user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await UserModel.findById(req.user!.userId);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    const response: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePictureUrl: user.profilePictureUrl,
      isChild: user.isChild,
    };

    // If parent, include children
    if (!user.isChild) {
      const children = await UserModel.findChildren(user.id);
      response.children = children.map(child => ({
        id: child.id,
        name: child.name,
        email: child.email,
      }));
    } else {
      response.parentId = user.parentId;
    }

    res.json(response);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch profile',
      },
    });
  }
});

// POST /api/auth/add-child - Add a child to parent account
router.post('/add-child', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await UserModel.findById(req.user!.userId);

    if (!user || user.isChild) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Only parents can add children',
        },
      });
    }

    const { name, email } = req.body as AddChildRequest;

    if (!name || !email) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Child name and email are required',
        },
      });
    }

    const child = await AuthService.addChild(user.id, name, email);

    res.status(201).json({
      id: child.id,
      name: child.name,
      email: child.email,
    });
  } catch (error: any) {
    console.error('Add child error:', error);
    res.status(400).json({
      error: {
        code: 'INVALID_REQUEST',
        message: error.message || 'Failed to add child',
      },
    });
  }
});

// GET /api/auth/children - Get all children for parent
router.get('/children', authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await UserModel.findById(req.user!.userId);

    if (!user || user.isChild) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Only parents can view children',
        },
      });
    }

    const children = await UserModel.findChildren(user.id);

    res.json(
      children.map(child => ({
        id: child.id,
        name: child.name,
        email: child.email,
      }))
    );
  } catch (error) {
    console.error('Fetch children error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch children',
      },
    });
  }
});

export default router;
