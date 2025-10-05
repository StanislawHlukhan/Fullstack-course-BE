"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const HEADER_NAME = 'x-request-id';
const plugin = async function (fastify) {
    fastify.addHook('onRequest', async (request, reply) => {
        reply.header(HEADER_NAME, request.id);
    });
};
exports.default = (0, fastify_plugin_1.default)(plugin, '5.x');
