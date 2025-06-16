"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./Config/db");
const userRoute_1 = __importDefault(require("./Routes/userRoute"));
const urlRoute_1 = __importDefault(require("./Routes/urlRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const urlController_1 = require("./Controller/urlController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
(0, db_1.connectDB)();
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});
app.use('/api/user', userRoute_1.default);
app.use('/api/url', urlRoute_1.default);
app.get("/:shortCode", urlController_1.UrlController.redirectToOriginal);
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
