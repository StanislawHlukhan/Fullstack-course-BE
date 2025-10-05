"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersRespSchema = void 0;
const zod_1 = require("zod");
const GetUserRespSchema_1 = require("./GetUserRespSchema");
exports.GetUsersRespSchema = zod_1.z.object({
    users: GetUserRespSchema_1.GetUserRespSchema.array(),
    total: zod_1.z.number()
});
