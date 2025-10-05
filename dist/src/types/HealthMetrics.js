"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthMetricsSchema = void 0;
const zod_1 = require("zod");
exports.HealthMetricsSchema = zod_1.z.object({
    isOk: zod_1.z.boolean(),
    serviceName: zod_1.z.string(),
    errorMessage: zod_1.z.unknown().optional()
});
