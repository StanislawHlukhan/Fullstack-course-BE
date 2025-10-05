"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentReqSchema = void 0;
const zod_1 = require("zod");
exports.CreateCommentReqSchema = zod_1.z.object({
    text: zod_1.z.string()
});
