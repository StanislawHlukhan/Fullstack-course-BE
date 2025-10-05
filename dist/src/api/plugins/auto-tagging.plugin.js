"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const plugin = async function (fastify) {
    fastify.addHook('onRoute', (routeOptions) => {
        if (routeOptions.url) {
            // First try to match `/api/admin/{tag}/...`
            let pathMatch = routeOptions.url.match(/^\/api\/admin\/([^\/]+)/);
            // If no match is found, try to match `/api/{tag}/...`
            if (!pathMatch) {
                pathMatch = routeOptions.url.match(/^\/api\/([^\/]+)/);
            }
            // Use the first capturing group as the tag, or 'default' if no matches are found
            const tag = pathMatch ? pathMatch[1] : 'default';
            // Add or modify the existing tags
            if (!routeOptions.schema) {
                // eslint-disable-next-line no-param-reassign
                routeOptions.schema = {};
            }
            const existingTags = routeOptions.schema.tags || [];
            // eslint-disable-next-line no-param-reassign
            routeOptions.schema.tags = [...existingTags, tag];
        }
    });
};
exports.default = (0, fastify_plugin_1.default)(plugin, '5.x');
