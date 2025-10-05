"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminHook = void 0;
const HttpError_1 = require("../errors/HttpError");
const adminHook = async function (request) {
    try {
        if (request.profile?.systemRole !== 'admin') {
            throw new Error('Not admin');
        }
    }
    catch (err) {
        throw new HttpError_1.HttpError(403, 'Forbidden', err);
    }
};
exports.adminHook = adminHook;
