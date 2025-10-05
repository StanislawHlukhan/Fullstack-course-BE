"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetMeRespShema_1 = require("../schemas/GetMeRespShema");
const routes = async function (f) {
    const fastify = f.withTypeProvider();
    fastify.get('/', {
        schema: {
            response: {
                200: GetMeRespShema_1.GetMeRespSchema
            }
        }
    }, async (req) => {
        return req.profile;
    });
};
exports.default = routes;
