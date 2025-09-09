"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlController = void 0;
const nanoid_1 = require("nanoid");
const urlModel_1 = __importDefault(require("../Model/urlModel"));
const statusCode_1 = require("../Constant/statusCode");
const errorMessage_1 = require("../Constant/errorMessage");
const successMessage_1 = require("../Constant/successMessage");
class UrlController {
    static async shortenUrl(req, res) {
        try {
            const { originalUrl } = req.body;
            const userId = req.user.userId;
            const existingUrl = await urlModel_1.default.findOne({ originalUrl, userId });
            if (existingUrl) {
                const response = {
                    success: true,
                    message: successMessage_1.SuccessMessages.URL_ALREADY_EXISTS,
                    data: {
                        originalUrl: existingUrl.originalUrl,
                        shortUrl: existingUrl.shortUrl,
                        shortCode: existingUrl.shortCode,
                        clickCount: existingUrl.clickCount,
                    },
                };
                res.status(statusCode_1.HttpStatusCode.OK).json(response);
                return;
            }
            let shortCode = (0, nanoid_1.nanoid)(8);
            let existing = await urlModel_1.default.findOne({ shortCode });
            while (existing) {
                shortCode = (0, nanoid_1.nanoid)(8);
                existing = await urlModel_1.default.findOne({ shortCode });
            }
            const baseUrl = process.env.BASE_URL;
            const shortUrl = `${baseUrl}/${shortCode}`;
            const url = new urlModel_1.default({
                originalUrl,
                shortCode,
                shortUrl,
                userId,
                clickCount: 0, // ✅ initialize
            });
            await url.save();
            const response = {
                success: true,
                message: successMessage_1.SuccessMessages.URL_SHORTENED_SUCCESSFULLY,
                data: {
                    originalUrl: url.originalUrl,
                    shortUrl: url.shortUrl,
                    shortCode: url.shortCode,
                    clickCount: url.clickCount,
                },
            };
            res.status(statusCode_1.HttpStatusCode.CREATED).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: errorMessage_1.ErrorMessages.SERVER_ERROR,
            };
            res.status(statusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
        }
    }
    static async getUserUrls(req, res) {
        try {
            const userId = req.user.userId;
            const urls = await urlModel_1.default.find({ userId }).sort({ createdAt: -1 });
            const response = {
                success: true,
                message: successMessage_1.SuccessMessages.URLS_RETRIEVED_SUCCESSFULLY,
                data: urls.map((url) => ({
                    id: url._id,
                    originalUrl: url.originalUrl,
                    shortUrl: url.shortUrl,
                    shortCode: url.shortCode,
                    clickCount: url.clickCount,
                    createdAt: url.createdAt,
                })),
            };
            res.status(statusCode_1.HttpStatusCode.OK).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                message: errorMessage_1.ErrorMessages.SERVER_ERROR,
            };
            res.status(statusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
        }
    }
    static async redirectToOriginal(req, res) {
        try {
            const { shortCode } = req.params;
            const url = await urlModel_1.default.findOne({ shortCode });
            if (!url) {
                const response = {
                    success: false,
                    message: errorMessage_1.ErrorMessages.URL_NOT_FOUND,
                };
                res.status(statusCode_1.HttpStatusCode.NOT_FOUND).json(response);
                return;
            }
            // ✅ increment click count
            url.clickCount = (url.clickCount || 0) + 1;
            await url.save();
            res.redirect(statusCode_1.HttpStatusCode.MOVED_PERMANENTLY, url.originalUrl);
        }
        catch (error) {
            console.error("Redirect error:", error);
            const response = {
                success: false,
                message: errorMessage_1.ErrorMessages.SERVER_ERROR,
            };
            res.status(statusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
        }
    }
}
exports.UrlController = UrlController;
