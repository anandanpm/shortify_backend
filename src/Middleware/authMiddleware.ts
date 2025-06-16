import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../Utils/jwtUtils';
import { AuthenticatedRequest } from '../Interface/authenticatedRequest';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
      try {
        const decoded = JwtUtils.verifyAccessToken(accessToken);
        (req as AuthenticatedRequest).user = {
          userId: decoded.userId,
          email: decoded.email,
        };
        return next();
      } catch (error) {
        console.error('Access token verification failed:', error);
      }
    }

    if (refreshToken) {
      try {
        const decoded = JwtUtils.verifyRefreshToken(refreshToken);

        // Generate a new access token
        const newAccessToken = JwtUtils.generateAccessToken({
          userId: decoded.userId,
          email: decoded.email,
        });

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 mins
        });

        (req as AuthenticatedRequest).user = {
          userId: decoded.userId,
          email: decoded.email,
        };

        return next();
      } catch (error) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token.',
        });
        return;
      }
    }

    res.status(401).json({
      success: false,
      message: 'Access denied. No valid token provided.',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};
