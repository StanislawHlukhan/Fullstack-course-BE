"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const HttpError_1 = require("./HttpError");
const util_1 = __importDefault(require("util"));
const EErrorCodes_1 = require("./EErrorCodes");
/*
We use HttpError only if we want to throw an error with a specific status code and error code.
So no need to write try/catch block for every route.
But take into account that logs will be used to build error metrics.
Metric label format will be next {error.type}_${error.cause.type}
*/
const isProduction = process.env.NODE_ENV === 'production';
const errorHandler = function (error, request, reply) {
    request.log.error(error);
    let errorCode = EErrorCodes_1.EErrorCodes.GENERAL_ERROR;
    let statusCode = 400;
    let message = 'Bad Request';
    if (error instanceof HttpError_1.HttpError) {
        if (error.errorCode) {
            errorCode = error.errorCode;
        }
        statusCode = error.statusCode;
        message = error.message;
    }
    // handle fastify errors
    if ('statusCode' in error) {
        statusCode = error.statusCode;
    }
    return reply.status(statusCode).send({
        code: errorCode,
        message,
        ...isProduction ? {} : { info: util_1.default.inspect(error) }
    });
};
exports.errorHandler = errorHandler;
