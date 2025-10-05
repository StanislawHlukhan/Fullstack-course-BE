"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTagRespSchema = void 0;
const zod_1 = require("zod");
exports.GetTagRespSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
