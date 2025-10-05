"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookEventSchema = void 0;
const zod_1 = require("zod");
exports.WebhookEventSchema = zod_1.z.object({
    id: zod_1.z.string(),
    eventId: zod_1.z.string(),
    eventType: zod_1.z.string(),
    data: zod_1.z.any(),
    processed: zod_1.z.boolean(),
    processedAt: zod_1.z.date().nullable(),
    createdAt: zod_1.z.date()
});
