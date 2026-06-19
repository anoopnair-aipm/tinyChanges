import axios from 'axios';
import jwt from 'jsonwebtoken';
import { UserModel, User } from '../models/User';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export class AuthService {
  static async verifyGoogleToken(code: string): Promise<GoogleUserInfo> {
    const tokenResponse = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.FRONTEND_URL}/api/auth/callback`,
        grant_type: 'authorization_code',
      }
    );

    const { id_token } = tokenResponse.data;

    // Verify and decode the JWT
    const decoded = jwt.decode(id_token) as GoogleUserInfo;
    if (!decoded) {
      throw new Error('Invalid token');
    }

    return decoded;
  }

  static async authenticateOrCreateUser(googleInfo: GoogleUserInfo): Promise<User> {
    // Check if user exists
    let user = await UserModel.findByGoogleId(googleInfo.sub);

    if (!user) {
      // Create new user
      user = await UserModel.create(
        googleInfo.sub,
        googleInfo.email,
        googleInfo.name,
        googleInfo.picture,
        false // Parent by default
      );
    } else {
      // Update profile picture and name if changed
      if (googleInfo.picture || googleInfo.name) {
        user = await UserModel.update(user.id, {
          profilePictureUrl: googleInfo.picture,
          name: googleInfo.name,
        });
      }
    }

    return user;
  }

  static generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isChild: user.isChild,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): { userId: string; email: string; isChild: boolean } | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      return decoded as { userId: string; email: string; isChild: boolean };
    } catch {
      return null;
    }
  }

  static async addChild(parentId: string, childName: string, childEmail: string): Promise<User> {
    // Check if child email already exists
    const existingUser = await UserModel.findByEmail(childEmail);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create child user with Google ID as placeholder
    const user = await UserModel.create(
      `child_${childEmail}_${Date.now()}`,
      childEmail,
      childName,
      undefined,
      true, // isChild
      parentId
    );

    return user;
  }
}
