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
                console.error("Access token verification failed:", error);
            }
        }
        res.status(401).json({
            success: false,
            message: "Access token required or expired.",
            code: "TOKEN_EXPIRED",
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Authentication error.",
            code: "AUTH_ERROR",
        });
    }
};
exports.authMiddleware = authMiddleware;
