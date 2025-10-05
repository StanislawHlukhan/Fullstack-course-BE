"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const toggle_user_account_1 = require("src/controllers/users/toggle-user-account");
const send_invite_for_user_1 = require("src/controllers/users/send-invite-for-user");
const soft_delete_user_1 = require("src/controllers/users/soft-delete-user");
const soft_restore_user_1 = require("src/controllers/users/soft-restore-user");
const PostWithProfile_1 = require("src/types/PostWithProfile");
const hard_delete_user_1 = require("src/controllers/users/hard-delete-user");
const hard_restore_user_1 = require("src/controllers/users/hard-restore-user");
const get_posts_by_profile_id_1 = require("src/controllers/post/get-posts-by-profile-id");
const drizzle_service_1 = require("src/services/drizzle/drizzle.service");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.post('/toggle-user-account', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid()
            }),
            body: zod_1.z.object({
                value: zod_1.z.boolean()
            })
        }
    }, async (req) => {
        await (0, toggle_user_account_1.toggleUserAccount)({
            id: req.params.userId,
            value: req.body.value,
            identityService: fastify.identityService,
            profileRepo: fastify.repos.profileRepo
        });
    });
    fastify.post('/send-invite-for-user', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid()
            })
        }
    }, async (req) => {
        await (0, send_invite_for_user_1.sendInviteForUser)({
            userId: req.params.userId,
            cryptoService: fastify.cryptoService,
            mailService: fastify.mailService,
            profileRepo: fastify.repos.profileRepo,
            inviteTTlMs: 1000 * 60 * 60 * 24 * 30
        });
    });
    fastify.delete('/hard-delete', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid()
            })
        }
    }, async (req) => {
        await (0, hard_delete_user_1.hardDeleteUser)({
            profileRepo: fastify.repos.profileRepo,
            postRepo: fastify.repos.postRepo,
            commentRepo: fastify.repos.commentRepo,
            archiveRepo: fastify.repos.archiveRepo,
            tagToPostRepo: fastify.repos.tagToPostRepo,
            transactionManager: (0, drizzle_service_1.getTransactionManager)(fastify.db),
            userId: req.params.userId
        });
    });
    fastify.post('/hard-restore', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid()
            })
        }
    }, async (req) => {
        await (0, hard_restore_user_1.hardRestoreUser)({
            profileRepo: fastify.repos.profileRepo,
            postRepo: fastify.repos.postRepo,
            commentRepo: fastify.repos.commentRepo,
            archiveRepo: fastify.repos.archiveRepo,
            tagToPostRepo: fastify.repos.tagToPostRepo,
            transactionManager: (0, drizzle_service_1.getTransactionManager)(fastify.db),
            userId: req.params.userId
        });
    });
    fastify.post('/soft-restore-user', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid()
            })
        }
    }, async (req) => {
        await (0, soft_restore_user_1.softRestoreUser)({
            profileRepo: fastify.repos.profileRepo,
            postRepo: fastify.repos.postRepo,
            commentRepo: fastify.repos.commentRepo,
            transactionManager: (0, drizzle_service_1.getTransactionManager)(fastify.db),
            identityService: fastify.identityService,
            id: req.params.userId
        });
    });
    fastify.delete('/soft-delete-user', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid()
            })
        }
    }, async (req) => {
        await (0, soft_delete_user_1.softDeleteUser)({
            profileRepo: fastify.repos.profileRepo,
            postRepo: fastify.repos.postRepo,
            commentRepo: fastify.repos.commentRepo,
            transactionManager: (0, drizzle_service_1.getTransactionManager)(fastify.db),
            identityService: fastify.identityService,
            id: req.params.userId
        });
    });
    // ASK FOR PROFILE ID
    fastify.get('/posts', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid()
            }),
            response: {
                200: zod_1.z.object({
                    posts: PostWithProfile_1.PostWithProfileSchema.array(),
                    total: zod_1.z.number()
                })
            }
        }
    }, async (req) => {
        const result = await (0, get_posts_by_profile_id_1.getPostsByProfileId)({
            postRepo: fastify.repos.postRepo,
            profileId: req.params.userId
        });
        return result;
    });
};
exports.default = routes;
