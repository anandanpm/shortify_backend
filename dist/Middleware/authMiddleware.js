"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwtUtils_1 = require("../Utils/jwtUtils");
const authMiddleware = (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;
        if (accessToken) {
            try {
                const decoded = jwtUtils_1.JwtUtils.verifyAccessToken(accessToken);
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email,
                };
                return next();
            }
            catch (error) {
                console.error('Access token verification failed:', error);
            }
        }
        if (refreshToken) {
            try {
                const decoded = jwtUtils_1.JwtUtils.verifyRefreshToken(refreshToken);
                // Generate a new access token
                const newAccessToken = jwtUtils_1.JwtUtils.generateAccessToken({
                    userId: decoded.userId,
                    email: decoded.email,
                });
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000, // 15 mins
                });
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email,
                };
                return next();
            }
            catch (error) {
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
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication error.',
        });
    }
};
exports.authMiddleware = authMiddleware;
