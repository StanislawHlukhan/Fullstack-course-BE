"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    statusCode;
    message;
    cause;
    errorCode;
    constructor(statusCode, message, cause, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.cause = cause;
        this.errorCode = errorCode;
    }
}
exports.HttpError = HttpError;
