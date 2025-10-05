"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserRespSchema = void 0;
const zod_1 = require("zod");
exports.GetUserRespSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string(),
    name: zod_1.z.string(),
    dickSize: zod_1.z.number(),
    createdAt: zod_1.z.date(),
    isEnabled: zod_1.z.boolean().optional(),
    activatedAt: zod_1.z.date().nullable().optional(),
    deletedAt: zod_1.z.date().nullable().optional()
});
