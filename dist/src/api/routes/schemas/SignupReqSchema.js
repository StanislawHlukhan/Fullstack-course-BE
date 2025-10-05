"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupReqSchema = void 0;
const zod_1 = require("zod");
exports.SignupReqSchema = zod_1.z.object({
    email: zod_1.z.string(),
    name: zod_1.z.string(),
    dickSize: zod_1.z.coerce.number().int().positive(),
    password: zod_1.z.string()
});
