"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHook = void 0;
const HttpError_1 = require("../errors/HttpError");
const userHook = async function (request) {
    try {
        if (request.profile?.systemRole !== 'user') {
            throw new Error('Not user');
        }
    }
    catch (err) {
        throw new HttpError_1.HttpError(403, 'Forbidden', err);
    }
};
exports.userHook = userHook;
