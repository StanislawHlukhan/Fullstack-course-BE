"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_tag_1 = require("src/controllers/tags/create-tag");
const get_tags_1 = require("src/controllers/tags/get-tags");
const CreateTagReqSchema_1 = require("../../schemas/CreateTagReqSchema");
const GetTagsRespShema_1 = require("../../schemas/GetTagsRespShema");
const GetTagRespShema_1 = require("../../schemas/GetTagRespShema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.get('/', {
        schema: {
            response: {
                200: GetTagsRespShema_1.GetTagsRespSchema
            }
        }
    }, async () => {
        const tags = await (0, get_tags_1.getTags)({
            tagRepo: fastify.repos.tagRepo
        });
        return tags;
    });
    fastify.post('/', {
        schema: {
            response: {
                200: GetTagRespShema_1.GetTagRespSchema
            },
            body: CreateTagReqSchema_1.CreateTagReqSchema
        }
    }, async (req) => {
        const tag = await (0, create_tag_1.createTag)({
            tagRepo: fastify.repos.tagRepo,
            data: req.body
        });
        return tag;
    });
};
exports.default = routes;
