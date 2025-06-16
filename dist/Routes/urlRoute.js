"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController_1 = require("../Controller/urlController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protected routes
router.post('/shorten', authMiddleware_1.authMiddleware, urlController_1.UrlController.shortenUrl);
router.get('/my-urls', authMiddleware_1.authMiddleware, urlController_1.UrlController.getUserUrls);
exports.default = router;
