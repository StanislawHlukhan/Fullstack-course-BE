"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostReqSchema = void 0;
const zod_1 = require("zod");
exports.CreatePostReqSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string()
});
