"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileSchema = exports.ESystemRole = void 0;
const zod_1 = require("zod");
var ESystemRole;
(function (ESystemRole) {
    ESystemRole["admin"] = "admin";
    ESystemRole["user"] = "user";
})(ESystemRole || (exports.ESystemRole = ESystemRole = {}));
exports.ProfileSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    dickSize: zod_1.z.number(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    subId: zod_1.z.string(),
    stripeCustomerId: zod_1.z.string().nullable().optional(),
    systemRole: zod_1.z.nativeEnum(ESystemRole),
    activatedAt: zod_1.z.date().nullable().optional(),
    deletedAt: zod_1.z.date().nullable().optional(),
    subscription: zod_1.z.object({
        name: zod_1.z.string(),
        expiresAt: zod_1.z.date(),
        customerPortalUrl: zod_1.z.string().url()
    }).nullable().optional()
});
