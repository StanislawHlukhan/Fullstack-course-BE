"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const HealthMetrics_1 = require("src/types/HealthMetrics");
const zod_1 = __importDefault(require("zod"));
const healthCheckResponseSchema = zod_1.default.array(HealthMetrics_1.HealthMetricsSchema.omit({ errorMessage: true }));
const plugin = async function (fastify, opts) {
    fastify.get(opts.path, { logLevel: 'silent' }, async (_req, reply) => {
        const healthChecks = await Promise.all(opts.healthChecksPromises.map((check) => check()));
        const statusCode = healthChecks.some((healthCheck) => !healthCheck.isOk) ? 500 : 200;
        reply.status(statusCode).send(healthCheckResponseSchema.parse(healthChecks));
    });
};
exports.default = (0, fastify_plugin_1.default)(plugin, '5.x');
