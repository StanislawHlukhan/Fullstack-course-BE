"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySchema = void 0;
const zod_1 = require("zod");
exports.EntitySchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional().nullable(),
    updatedAt: zod_1.z.date(),
    createdAt: zod_1.z.date()
});
