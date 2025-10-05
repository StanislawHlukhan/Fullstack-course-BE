"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_post_by_id_1 = require("src/controllers/post/update-post-by-id");
const zod_1 = require("zod");
const CreatePostReqSchema_1 = require("src/api/routes/schemas/CreatePostReqSchema");
const add_tag_to_post_1 = require("src/controllers/tags/add-tag-to-post");
const remove_tag_from_post_1 = require("src/controllers/tags/remove-tag-from-post");
const soft_delete_post_1 = require("src/controllers/post/soft-delete-post");
const soft_restore_post_1 = require("src/controllers/post/soft-restore-post");
const drizzle_service_1 = require("src/services/drizzle/drizzle.service");
const GetPostRespShema_1 = require("src/api/routes/schemas/GetPostRespShema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.patch('/', {
        schema: {
            response: {
                200: GetPostRespShema_1.GetPostRespSchema
            },
            params: zod_1.z.object({
                postId: zod_1.z.string()
            }),
            body: CreatePostReqSchema_1.CreatePostReqSchema
        }
    }, async (req) => {
        const post = await (0, update_post_by_id_1.updatePostById)({
            postRepo: fastify.repos.postRepo,
            postId: req.params.postId,
            data: req.body
        });
        return post;
    });
    fastify.post('/add-tag-to-post', {
        schema: {
            response: {
                200: zod_1.z.object({
                    success: zod_1.z.boolean()
                })
            },
            params: zod_1.z.object({
                postId: zod_1.z.string()
            }),
            body: zod_1.z.object({
                tagIds: zod_1.z.string().array()
            })
        }
    }, async (req) => {
        const post = await (0, add_tag_to_post_1.addTagToPost)({
            tagToPostRepo: fastify.repos.tagToPostRepo,
            postId: req.params.postId,
            tagIds: req.body.tagIds
        });
        return post;
    });
    fastify.delete('/remove-tag-from-post', {
        schema: {
            response: {
                200: zod_1.z.object({
                    success: zod_1.z.boolean()
                })
            },
            params: zod_1.z.object({
                postId: zod_1.z.string()
            }),
            body: zod_1.z.object({
                tagIds: zod_1.z.string().array()
            })
        }
    }, async (req) => {
        const post = await (0, remove_tag_from_post_1.removeTagFromPost)({
            tagToPostRepo: fastify.repos.tagToPostRepo,
            postId: req.params.postId,
            tagIds: req.body.tagIds
        });
        return post;
    });
    fastify.delete('/soft-delete', {
        schema: {
            params: zod_1.z.object({
                postId: zod_1.z.string()
            }),
            response: {
                200: zod_1.z.object({
                    success: zod_1.z.boolean()
                })
            }
        }
    }, async (req) => {
        const post = await (0, soft_delete_post_1.softDeletePost)({
            postRepo: fastify.repos.postRepo,
            commentRepo: fastify.repos.commentRepo,
            transactionManager: (0, drizzle_service_1.getTransactionManager)(fastify.db),
            id: req.params.postId
        });
        return post;
    });
    fastify.post('/soft-restore', {
        schema: {
            params: zod_1.z.object({
                postId: zod_1.z.string()
            }),
            response: {
                200: zod_1.z.object({
                    success: zod_1.z.boolean()
                })
            }
        }
    }, async (req) => {
        const post = await (0, soft_restore_post_1.softRestorePost)({
            postRepo: fastify.repos.postRepo,
            commentRepo: fastify.repos.commentRepo,
            transactionManager: (0, drizzle_service_1.getTransactionManager)(fastify.db),
            id: req.params.postId
        });
        return post;
    });
};
exports.default = routes;
