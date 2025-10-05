"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accept_invite_1 = require("src/controllers/users/accept-invite");
const zod_1 = require("zod");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.addHook('onRoute', (routeOptions) => {
        if (!routeOptions.config) {
            routeOptions.config = {};
        }
        routeOptions.config.skipAuth = true;
    });
    fastify.post('/accept-invite', {
        schema: {
            body: zod_1.z.object({
                email: zod_1.z.string().email(),
                password: zod_1.z.string(),
                signature: zod_1.z.string(),
                expireAtMs: zod_1.z.number()
            }),
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid()
            })
        }
    }, async (req) => {
        await (0, accept_invite_1.acceptInvite)({
            userId: req.params.userId,
            email: req.body.email,
            password: req.body.password,
            signature: req.body.signature,
            expireAtMs: req.body.expireAtMs,
            cryptoService: fastify.cryptoService,
            identityService: fastify.identityService,
            profileRepo: fastify.repos.profileRepo
        });
    });
};
exports.default = routes;
