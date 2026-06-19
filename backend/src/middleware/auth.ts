import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    isChild: boolean;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization token',
      },
    });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload as AuthRequest['user'];
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
};

export const parentOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.isChild) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'This action is only available to parents',
      },
    });
  }
  next();
};

export const childOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isChild) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'This action is only available to children',
      },
    });
  }
  next();
};
