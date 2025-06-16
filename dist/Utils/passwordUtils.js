"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtils = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordUtils {
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt_1.default.hash(password, saltRounds);
    }
    static async comparePassword(password, hashedPassword) {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.PasswordUtils = PasswordUtils;
