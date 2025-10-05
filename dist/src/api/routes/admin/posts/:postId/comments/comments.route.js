"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_comment_1 = require("src/controllers/comment/create-comment");
const zod_1 = require("zod");
const get_comments_by_post_id_1 = require("src/controllers/comment/get-comments-by-post-id");
const CreateCommentReqSchema_1 = require("src/api/routes/schemas/CreateCommentReqSchema");
const GetCommentRespShema_1 = require("src/api/routes/schemas/GetCommentRespShema");
const GetCommentsRespShema_1 = require("src/api/routes/schemas/GetCommentsRespShema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.post('/', {
        schema: {
            response: {
                200: GetCommentRespShema_1.GetCommentRespSchema
            },
            params: zod_1.z.object({
                postId: zod_1.z.string().uuid()
            }),
            body: CreateCommentReqSchema_1.CreateCommentReqSchema
        }
    }, async (req) => {
        const comment = await (0, create_comment_1.createComment)({
            commentRepo: fastify.repos.commentRepo,
            data: {
                ...req.body,
                createdBy: req.profile.id
            },
            postId: req.params.postId
        });
        return comment;
    });
    fastify.get('/', {
        schema: {
            response: {
                200: GetCommentsRespShema_1.GetCommentsRespSchema
            },
            params: zod_1.z.object({
                postId: zod_1.z.string().uuid()
            })
        }
    }, async (req) => {
        const comments = await (0, get_comments_by_post_id_1.getCommentsByPostId)({
            commentRepo: fastify.repos.commentRepo,
            postId: req.params.postId
        });
        return comments;
    });
};
exports.default = routes;
