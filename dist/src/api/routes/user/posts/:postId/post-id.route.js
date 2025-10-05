"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetPostRespShema_1 = require("src/api/routes/schemas/GetPostRespShema");
const update_post_by_id_1 = require("src/controllers/post/update-post-by-id");
const zod_1 = require("zod");
const CreatePostReqSchema_1 = require("src/api/routes/schemas/CreatePostReqSchema");
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
};
exports.default = routes;
