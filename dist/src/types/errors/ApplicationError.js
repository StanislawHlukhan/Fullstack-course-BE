"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = void 0;
// All app errors (repose, modules, services) should extend this class
class ApplicationError extends Error {
    message;
    cause;
    constructor(message, cause) {
        super(message);
        this.message = message;
        this.cause = cause;
    }
}
exports.ApplicationError = ApplicationError;
