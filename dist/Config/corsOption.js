"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const allowedOrigin = process.env.FRONTEND_URL;
if (!allowedOrigin) {
    console.warn('⚠️ FRONTEND_URL is not defined in environment variables');
}
exports.corsOptions = {
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};
