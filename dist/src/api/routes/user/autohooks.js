"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_hook_1 = require("../../hooks/user.hook");
const ownership_hook_1 = require("../../hooks/ownership.hook");
const hooks = async function (fastify) {
    fastify.addHook('preHandler', user_hook_1.userHook);
    fastify.addHook('preHandler', ownership_hook_1.ownershipHook);
};
exports.default = hooks;
