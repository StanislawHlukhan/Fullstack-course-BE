"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const HEADER_NAME = 'x-response-time';
const plugin = async function (fastify) {
    fastify.addHook('onRequest', async (request) => {
        // eslint-disable-next-line no-param-reassign
        request.starTimeMS = Date.now();
    });
    fastify.addHook('onSend', async (request, reply) => {
        const responseTime = Date.now() - request.starTimeMS;
        reply.header(HEADER_NAME, `${responseTime}`);
    });
};
exports.default = (0, fastify_plugin_1.default)(plugin, '5.x');
