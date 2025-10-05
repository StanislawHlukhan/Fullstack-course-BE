"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommentsRespSchema = void 0;
const zod_1 = require("zod");
const GetCommentRespShema_1 = require("./GetCommentRespShema");
exports.GetCommentsRespSchema = zod_1.z.array(GetCommentRespShema_1.GetCommentRespSchema);
