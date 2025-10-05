"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBError = void 0;
const ApplicationError_1 = require("./ApplicationError");
class DBError extends ApplicationError_1.ApplicationError {
    constructor(message, cause) {
        super(message, cause);
    }
}
exports.DBError = DBError;
