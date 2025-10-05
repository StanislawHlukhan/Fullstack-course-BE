"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testHook = void 0;
const HttpError_1 = require("../errors/HttpError");
const testHook = async function (request) {
    try {
        request.log.info('test');
    }
    catch (err) {
        throw new HttpError_1.HttpError(400, 'Test err', err);
    }
};
exports.testHook = testHook;
