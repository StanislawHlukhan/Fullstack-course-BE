"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUIDService = getUUIDService;
const crypto_1 = require("crypto");
function getUUIDService() {
    return {
        getUUID() {
            return (0, crypto_1.randomUUID)();
        }
    };
}
