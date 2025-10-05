"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_hook_1 = require("../../hooks/admin.hook");
const hooks = async function (fastify) {
    fastify.addHook('preHandler', admin_hook_1.adminHook);
};
exports.default = hooks;
