"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const GetUsersRespShema_1 = require("../../schemas/GetUsersRespShema");
const get_users_1 = require("src/controllers/users/get-users");
const create_user_1 = require("src/controllers/users/create-user");
const CreateUserReqSchema_1 = require("../../schemas/CreateUserReqSchema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.get('/', {
        schema: {
            querystring: zod_1.z.object({
                limit: zod_1.z.coerce.number().int().positive().optional(),
                page: zod_1.z.coerce.number().int().positive().optional(),
                search: zod_1.z.string().optional()
            }),
            response: {
                200: GetUsersRespShema_1.GetUsersRespSchema
            }
        }
    }, async (req) => {
        const users = await (0, get_users_1.getUsers)({
            profileRepo: fastify.repos.profileRepo,
            identityService: fastify.identityService,
            limit: req.query.limit || undefined,
            page: req.query.page || undefined,
            search: req.query.search || undefined
        });
        return users;
    });
    fastify.post('/create-user', {
        schema: {
            body: CreateUserReqSchema_1.CreateUserReqSchema
        }
    }, async (req) => {
        const user = await (0, create_user_1.createUser)({
            identityService: fastify.identityService,
            profileRepo: fastify.repos.profileRepo,
            email: req.body.email,
            name: req.body.name,
            dickSize: req.body.dickSize
        });
        return user;
    });
};
exports.default = routes;
