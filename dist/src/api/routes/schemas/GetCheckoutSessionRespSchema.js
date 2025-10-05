"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCheckoutSessionRespSchema = void 0;
const zod_1 = require("zod");
exports.GetCheckoutSessionRespSchema = zod_1.z.object({
    id: zod_1.z.string(),
    url: zod_1.z.string().url()
});
