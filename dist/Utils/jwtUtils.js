"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class JwtUtils {
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.ACCESS_SECRET, { expiresIn: '15m' });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.REFRESH_SECRET, { expiresIn: '7d' });
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, this.ACCESS_SECRET);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, this.REFRESH_SECRET);
    }
}
exports.JwtUtils = JwtUtils;
JwtUtils.ACCESS_SECRET = (() => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
    }
    return process.env.JWT_ACCESS_SECRET;
})();
JwtUtils.REFRESH_SECRET = (() => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    return process.env.JWT_REFRESH_SECRET;
})();
