import jwt from 'jsonwebtoken';
import { JwtPayload } from '../Interface/jwtInterface';
import dotenv from 'dotenv';
dotenv.config();

export class JwtUtils {
  private static readonly ACCESS_SECRET: string = (() => {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
    }
    return process.env.JWT_ACCESS_SECRET;
  })();
  private static readonly REFRESH_SECRET: string = (() => {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    return process.env.JWT_REFRESH_SECRET;
  })();

  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.ACCESS_SECRET, { expiresIn: '15m' }); 
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: '7d' }); 
  }

  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.ACCESS_SECRET) as JwtPayload;
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as JwtPayload;
  }
}
