"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBDuplicateError = void 0;
const ApplicationError_1 = require("./ApplicationError");
class DBDuplicateError extends ApplicationError_1.ApplicationError {
    constructor(entity, cause) {
        super(`Duplicate in ${entity}`, cause);
    }
}
exports.DBDuplicateError = DBDuplicateError;
