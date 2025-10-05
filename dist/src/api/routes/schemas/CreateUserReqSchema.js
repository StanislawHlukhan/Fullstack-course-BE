"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserReqSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserReqSchema = zod_1.z.object({
    email: zod_1.z.string(),
    name: zod_1.z.string(),
    dickSize: zod_1.z.coerce.number().int().positive()
});
