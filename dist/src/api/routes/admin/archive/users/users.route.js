"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_soft_deleted_users_1 = require("src/controllers/users/get-soft-deleted-users");
const GetUsersRespShema_1 = require("src/api/routes/schemas/GetUsersRespShema");
const get_hard_deleted_users_1 = require("src/controllers/users/get-hard-deleted-users");
const GetHardDeletedRespSchema_1 = require("src/api/routes/schemas/GetHardDeletedRespSchema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.get('/soft-deleted', {
        schema: {
            response: {
                200: GetUsersRespShema_1.GetUsersRespSchema
            }
        }
    }, async () => {
        const users = await (0, get_soft_deleted_users_1.getSoftDeletedUsers)({
            profileRepo: fastify.repos.profileRepo,
            identityService: fastify.identityService
        });
        return users;
    });
    fastify.get('/hard-deleted', {
        schema: {
            response: {
                200: GetHardDeletedRespSchema_1.GetHardDeletedRespSchema
            }
        }
    }, async () => {
        const result = await (0, get_hard_deleted_users_1.getHardDeletedUsers)({
            repos: fastify.repos
        });
        return result;
    });
};
exports.default = routes;
