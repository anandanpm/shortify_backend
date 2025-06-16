"use strict";
// import { Request, Response } from 'express';
// import User from '../Model/userModel';
// import { IUser } from '../Interface/userInterface';
// import { PasswordUtils } from '../Utils/passwordUtils'; 
// import { JwtUtils } from '../Utils/jwtUtils';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userModel_1 = __importDefault(require("../Model/userModel"));
const passwordUtils_1 = require("../Utils/passwordUtils");
const jwtUtils_1 = require("../Utils/jwtUtils");
const statusCode_1 = require("../Constant/statusCode");
const errorMessage_1 = require("../Constant/errorMessage");
const successMessage_1 = require("../Constant/successMessage");
class UserController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            console.log('Registering user:', { name, email });
            // Check if user exists
            const existingUser = await userModel_1.default.findOne({ email });
            if (existingUser) {
                const response = {
                    success: false,
                    message: errorMessage_1.ErrorMessages.USER_ALREADY_EXISTS
                };
                res.status(statusCode_1.HttpStatusCode.BAD_REQUEST).json(response);
                return;
            }
            // Hash password
            const hashedPassword = await passwordUtils_1.PasswordUtils.hashPassword(password);
            // Create user
            const user = new userModel_1.default({
                name,
                email,
                password: hashedPassword
            });
            await user.save();
            const response = {
                success: true,
                message: successMessage_1.SuccessMessages.USER_REGISTERED_SUCCESSFULLY,
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            };
            res.status(statusCode_1.HttpStatusCode.CREATED).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: errorMessage_1.ErrorMessages.SERVER_ERROR
            };
            res.status(statusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // Find user
            const user = await userModel_1.default.findOne({ email });
            if (!user) {
                const response = {
                    success: false,
                    message: errorMessage_1.ErrorMessages.INVALID_CREDENTIALS
                };
                res.status(statusCode_1.HttpStatusCode.UNAUTHORIZED).json(response);
                return;
            }
            // Check password
            const isPasswordValid = await passwordUtils_1.PasswordUtils.comparePassword(password, user.password);
            if (!isPasswordValid) {
                const response = {
                    success: false,
                    message: errorMessage_1.ErrorMessages.INVALID_CREDENTIALS
                };
                res.status(statusCode_1.HttpStatusCode.UNAUTHORIZED).json(response);
                return;
            }
            // Generate tokens
            const accessToken = jwtUtils_1.JwtUtils.generateAccessToken({
                userId: user._id.toString(),
                email: user.email
            });
            const refreshToken = jwtUtils_1.JwtUtils.generateRefreshToken({
                userId: user._id.toString(),
                email: user.email
            });
            // Set cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            const response = {
                success: true,
                message: successMessage_1.SuccessMessages.LOGIN_SUCCESSFUL,
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            };
            res.status(statusCode_1.HttpStatusCode.OK).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: errorMessage_1.ErrorMessages.SERVER_ERROR
            };
            res.status(statusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
        }
    }
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                const response = {
                    success: false,
                    message: errorMessage_1.ErrorMessages.REFRESH_TOKEN_NOT_PROVIDED
                };
                res.status(statusCode_1.HttpStatusCode.UNAUTHORIZED).json(response);
                return;
            }
            // Verify refresh token
            const decoded = jwtUtils_1.JwtUtils.verifyRefreshToken(refreshToken);
            if (!decoded) {
                const response = {
                    success: false,
                    message: errorMessage_1.ErrorMessages.INVALID_REFRESH_TOKEN
                };
                res.status(statusCode_1.HttpStatusCode.UNAUTHORIZED).json(response);
                return;
            }
            // Find user
            const user = await userModel_1.default.findById(decoded.userId);
            if (!user) {
                const response = {
                    success: false,
                    message: errorMessage_1.ErrorMessages.USER_NOT_FOUND
                };
                res.status(statusCode_1.HttpStatusCode.UNAUTHORIZED).json(response);
                return;
            }
            // Generate new tokens
            const newAccessToken = jwtUtils_1.JwtUtils.generateAccessToken({
                userId: user._id.toString(),
                email: user.email
            });
            const newRefreshToken = jwtUtils_1.JwtUtils.generateRefreshToken({
                userId: user._id.toString(),
                email: user.email
            });
            // Set new cookies
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            const response = {
                success: true,
                message: successMessage_1.SuccessMessages.TOKENS_REFRESHED_SUCCESSFULLY,
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            };
            res.status(statusCode_1.HttpStatusCode.OK).json(response);
        }
        catch (error) {
            console.error('Refresh token error:', error);
            const response = {
                success: false,
                message: errorMessage_1.ErrorMessages.SERVER_ERROR
            };
            res.status(statusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
        }
    }
    static async logout(req, res) {
        try {
            // Clear cookies
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            const response = {
                success: true,
                message: successMessage_1.SuccessMessages.LOGOUT_SUCCESSFUL
            };
            res.status(statusCode_1.HttpStatusCode.OK).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: errorMessage_1.ErrorMessages.SERVER_ERROR
            };
            res.status(statusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
        }
    }
}
exports.UserController = UserController;
