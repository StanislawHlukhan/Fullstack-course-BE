"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const plugin = async function (fastify, opts) {
    fastify.addHook('onRoute', async (routeOptions) => {
        const skip = (opts.skip || []).some((url) => routeOptions.url.includes(url));
        if (skip) {
            return;
        }
        fastify.log.info(`Route: ${routeOptions.method} ${routeOptions.url}`);
    });
};
exports.default = (0, fastify_plugin_1.default)(plugin, '5.x');
