"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityUserSchema = void 0;
const zod_1 = require("zod");
exports.IdentityUserSchema = zod_1.z.object({
    subId: zod_1.z.string(),
    email: zod_1.z.string(),
    isEnabled: zod_1.z.boolean().optional()
});
