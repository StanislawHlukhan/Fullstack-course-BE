"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateTagReqSchema_1 = require("src/api/routes/schemas/CreateTagReqSchema");
const delete_tag_1 = require("src/controllers/tags/delete-tag");
const update_tag_1 = require("src/controllers/tags/update-tag");
const GetTagRespShema_1 = require("src/api/routes/schemas/GetTagRespShema");
const zod_1 = require("zod");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.patch('/', {
        schema: {
            response: {
                200: GetTagRespShema_1.GetTagRespSchema
            },
            params: zod_1.z.object({
                tagId: zod_1.z.string()
            }),
            body: CreateTagReqSchema_1.CreateTagReqSchema
        }
    }, async (req) => {
        const tag = await (0, update_tag_1.updateTag)({
            tagRepo: fastify.repos.tagRepo,
            id: req.params.tagId,
            data: req.body
        });
        return tag;
    });
    fastify.delete('/', {
        schema: {
            response: {
                200: zod_1.z.object({
                    success: zod_1.z.boolean()
                })
            },
            params: zod_1.z.object({
                tagId: zod_1.z.string()
            })
        }
    }, async (req) => {
        const tag = await (0, delete_tag_1.deleteTag)({
            tagRepo: fastify.repos.tagRepo,
            tagToPostRepo: fastify.repos.tagToPostRepo,
            id: req.params.tagId
        });
        return tag;
    });
};
exports.default = routes;
