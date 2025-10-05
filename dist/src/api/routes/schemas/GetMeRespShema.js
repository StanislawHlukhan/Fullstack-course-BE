"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMeRespSchema = void 0;
const Profile_1 = require("src/types/Profile");
const zod_1 = require("zod");
exports.GetMeRespSchema = zod_1.z.object({
    email: zod_1.z.string().optional().nullable(),
    subId: zod_1.z.string(),
    name: zod_1.z.string(),
    dickSize: zod_1.z.number(),
    createdAt: zod_1.z.date(),
    id: zod_1.z.string().uuid(),
    systemRole: zod_1.z.nativeEnum(Profile_1.ESystemRole),
    subscription: zod_1.z.object({
        name: zod_1.z.string(),
        expiresAt: zod_1.z.date(),
        customerPortalUrl: zod_1.z.string().url().optional()
    }).nullable().optional()
});
;
