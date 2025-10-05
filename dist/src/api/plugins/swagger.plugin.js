"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const basic_auth_1 = __importDefault(require("@fastify/basic-auth"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const EErrorCodes_1 = require("../errors/EErrorCodes");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
async function setupSwagger(server, userName, pwd) {
    await server.register(basic_auth_1.default, {
        validate(u, p, _req, _reply, done) {
            if (u === userName && pwd === p) {
                done();
            }
            else {
                done(new Error('Unauthorized'));
            }
        },
        authenticate: true
    });
    await server.register(swagger_1.default, {
        openapi: {
            info: {
                title: 'fastify-boilerplate',
                description: 'fastify-boilerplate',
                version: '1.0.0'
            },
            servers: [],
            security: [{ auth: [] }],
            components: {
                securitySchemes: {
                    auth: {
                        description: 'Authorization header token, sample: "Bearer {TOKEN}"',
                        type: 'apiKey',
                        name: 'authorization',
                        in: 'header'
                    }
                },
                schemas: {
                    ErrorCodes: {
                        type: 'integer',
                        enum: Object.values(EErrorCodes_1.EErrorCodes).filter((value) => typeof value === 'number'),
                        description: (0, EErrorCodes_1.getErrorCodesDescription)()
                    }
                }
            }
        },
        transform: fastify_type_provider_zod_1.jsonSchemaTransform
    });
    await server.register(swagger_ui_1.default, {
        routePrefix: '/api/documentation',
        logLevel: 'silent',
        uiHooks: {
            onRequest: server.basicAuth
        }
    });
}
