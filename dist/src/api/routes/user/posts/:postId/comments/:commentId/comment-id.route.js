"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_comment_by_id_and_post_id_1 = require("src/controllers/comment/update-comment-by-id-and-post-id");
const CreateCommentReqSchema_1 = require("src/api/routes/schemas/CreateCommentReqSchema");
const zod_1 = require("zod");
const GetCommentRespShema_1 = require("src/api/routes/schemas/GetCommentRespShema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.patch('/', {
        schema: {
            response: {
                200: GetCommentRespShema_1.GetCommentRespSchema
            },
            params: zod_1.z.object({
                postId: zod_1.z.string().uuid(),
                commentId: zod_1.z.string().uuid()
            }),
            body: CreateCommentReqSchema_1.CreateCommentReqSchema
        }
    }, async (req) => {
        const comment = await (0, update_comment_by_id_and_post_id_1.updateCommentByIdAndPostId)({
            commentRepo: fastify.repos.commentRepo,
            id: req.params.commentId,
            postId: req.params.postId,
            data: req.body
        });
        return comment;
    });
};
exports.default = routes;
