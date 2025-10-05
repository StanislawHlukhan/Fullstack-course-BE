"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTagsRespSchema = void 0;
const zod_1 = require("zod");
const GetTagRespShema_1 = require("./GetTagRespShema");
exports.GetTagsRespSchema = zod_1.z.array(GetTagRespShema_1.GetTagRespSchema);
