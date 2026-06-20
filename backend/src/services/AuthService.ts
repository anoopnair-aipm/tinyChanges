import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { UserModel, User } from '../models/User';

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export class AuthService {
  static async verifyGoogleToken(code: string): Promise<GoogleUserInfo> {
    const redirectUri = `${process.env.FRONTEND_URL}/api/auth/callback`;
    console.log('Google token exchange - redirect_uri:', redirectUri);

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error('No id_token returned from Google');
    }

    // Decode the JWT (already verified by google-auth-library)
    const decoded = jwt.decode(idToken) as GoogleUserInfo;
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
