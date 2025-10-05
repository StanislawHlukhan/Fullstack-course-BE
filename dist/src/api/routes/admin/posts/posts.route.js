"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_posts_1 = require("src/controllers/post/get-posts");
const create_post_1 = require("src/controllers/post/create-post");
const CreatePostReqSchema_1 = require("../../schemas/CreatePostReqSchema");
const zod_1 = require("zod");
const get_soft_deleted_posts_1 = require("src/controllers/post/get-soft-deleted-posts");
const GetPostsRespShema_1 = require("../../schemas/GetPostsRespShema");
const GetPostRespShema_1 = require("src/api/routes/schemas/GetPostRespShema");
const GetSoftDeletedPostsRespShema_1 = require("src/api/routes/schemas/GetSoftDeletedPostsRespShema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.get('/', {
        schema: {
            querystring: zod_1.z.object({
                limit: zod_1.z.coerce.number().int().positive().optional(),
                page: zod_1.z.coerce.number().int().positive().optional(),
                search: zod_1.z.string().optional(),
                sortBy: zod_1.z.enum(['title', 'createdAt', 'commentCount']).nullable().optional(),
                sortOrder: zod_1.z.enum(['asc', 'desc']).nullable().optional(),
                commentCount: zod_1.z.coerce.number().int().optional(),
                tagIds: zod_1.z.array(zod_1.z.string().uuid()).optional()
            }),
            response: {
                200: GetPostsRespShema_1.GetPostsRespSchema
            }
        }
    }, async (req) => {
        const result = await (0, get_posts_1.getPosts)({
            postRepo: fastify.repos.postRepo,
            options: {
                limit: req.query.limit || undefined,
                page: req.query.page || undefined,
                search: req.query.search,
                sortBy: req.query.sortBy || undefined,
                sortOrder: req.query.sortOrder || undefined,
                commentCount: req.query.commentCount || undefined,
                tagIds: req.query.tagIds || undefined
            }
        });
        return result;
    });
    fastify.post('/', {
        schema: {
            response: {
                200: GetPostRespShema_1.GetPostRespSchema
            },
            body: CreatePostReqSchema_1.CreatePostReqSchema
        }
    }, async (req) => {
        const post = await (0, create_post_1.createPost)({
            postRepo: fastify.repos.postRepo,
            data: {
                ...req.body,
                createdBy: req.profile.id
            }
        });
        return post;
    });
    fastify.get('/soft-deleted', {
        schema: {
            response: {
                200: GetSoftDeletedPostsRespShema_1.GetSoftDeletedPostsRespSchema
            }
        }
    }, async () => {
        const posts = await (0, get_soft_deleted_posts_1.getSoftDeletedPosts)({
            postRepo: fastify.repos.postRepo
        });
        return posts;
    });
};
exports.default = routes;
