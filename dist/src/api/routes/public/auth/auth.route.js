"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signup_user_1 = require("src/controllers/users/signup-user");
const SignupReqSchema_1 = require("../../schemas/SignupReqSchema");
const GetUserRespSchema_1 = require("../../schemas/GetUserRespSchema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.addHook('onRoute', (routeOptions) => {
        if (!routeOptions.config) {
            routeOptions.config = {};
        }
        routeOptions.config.skipAuth = true;
    });
    fastify.post('/signup', {
        schema: {
            body: SignupReqSchema_1.SignupReqSchema,
            response: {
                200: GetUserRespSchema_1.GetUserRespSchema
            }
        }
    }, async (req) => {
        const user = await (0, signup_user_1.signupUser)({
            identityService: fastify.identityService,
            profileRepo: fastify.repos.profileRepo,
            email: req.body.email,
            name: req.body.name,
            dickSize: req.body.dickSize,
            password: req.body.password
        });
        return user;
    });
};
exports.default = routes;
