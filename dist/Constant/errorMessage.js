"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
var ErrorMessages;
(function (ErrorMessages) {
    // User errors
    ErrorMessages["USER_ALREADY_EXISTS"] = "User already exists";
    ErrorMessages["INVALID_CREDENTIALS"] = "Invalid credentials";
    ErrorMessages["USER_NOT_FOUND"] = "User not found";
    ErrorMessages["REFRESH_TOKEN_NOT_PROVIDED"] = "Refresh token not provided";
    ErrorMessages["INVALID_REFRESH_TOKEN"] = "Invalid refresh token";
    // URL errors
    ErrorMessages["URL_NOT_FOUND"] = "URL not found";
    // Generic errors
    ErrorMessages["SERVER_ERROR"] = "Server error";
})(ErrorMessages || (exports.ErrorMessages = ErrorMessages = {}));
