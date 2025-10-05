"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_hook_1 = require("../hooks/auth.hook");
const hooks = async function (fastify) {
    fastify.addHook('preHandler', auth_hook_1.authHook);
};
exports.default = hooks;
