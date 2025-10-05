"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBDeleteError = void 0;
const ApplicationError_1 = require("./ApplicationError");
class DBDeleteError extends ApplicationError_1.ApplicationError {
    constructor(message, cause) {
        super(message, cause);
    }
}
exports.DBDeleteError = DBDeleteError;
