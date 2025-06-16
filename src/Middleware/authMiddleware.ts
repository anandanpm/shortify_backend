import type { Request, Response, NextFunction } from "express"
import { JwtUtils } from "../Utils/jwtUtils"
import type { AuthenticatedRequest } from "../Interface/authenticatedRequest"

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const accessToken = req.cookies?.accessToken
    const refreshToken = req.cookies?.refreshToken

    if (accessToken) {
      try {
        const decoded = JwtUtils.verifyAccessToken(accessToken)
        ;(req as AuthenticatedRequest).user = {
          userId: decoded.userId,
          email: decoded.email,
        }
        return next()
      } catch (error) {
        console.error("Access token verification failed:", error)
        // Don't automatically refresh here - let the client handle it
      }
    }

    // If no valid access token, return 401 and let client handle refresh
    res.status(401).json({
      success: false,
      message: "Access token required or expired.",
      code: "TOKEN_EXPIRED",
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication error.",
      code: "AUTH_ERROR",
    })
  }
}
