"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("src/services/env/env.service");
const fastify_1 = __importDefault(require("fastify"));
const autoload_1 = __importDefault(require("@fastify/autoload"));
const path_1 = __importDefault(require("path"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const uuid_service_1 = require("src/services/uuid/uuid.service");
const error_handler_1 = require("./errors/error.handler");
const crypto_1 = __importDefault(require("crypto"));
const repos_1 = require("src/repos");
const helmet_1 = __importDefault(require("@fastify/helmet"));
const cors_1 = __importDefault(require("@fastify/cors"));
const auto_tagging_plugin_1 = __importDefault(require("./plugins/auto-tagging.plugin"));
const request_id_plugin_1 = __importDefault(require("./plugins/request-id.plugin"));
const response_time_plugin_1 = __importDefault(require("./plugins/response-time.plugin"));
const health_check_plugin_1 = __importDefault(require("./plugins/health-check.plugin"));
const route_printer_plugin_1 = __importDefault(require("./plugins/route-printer.plugin"));
const swagger_plugin_1 = require("./plugins/swagger.plugin");
const logger_plugin_1 = require("./plugins/logger.plugin");
const drizzle_service_1 = require("src/services/drizzle/drizzle.service");
const cognito_service_1 = require("src/services/aws/cognito/cognito.service");
const sendgrid_service_1 = require("src/services/sendgrid/sendgrid.service");
const kms_service_1 = require("src/services/kms/kms.service");
const fastify_raw_body_1 = __importDefault(require("fastify-raw-body"));
async function run() {
    const server = (0, fastify_1.default)({
        // get from reverse proxy
        // or using genReqId
        genReqId: () => crypto_1.default.randomUUID(),
        // if reverse proxy has x-request-id use if for request id
        requestIdHeader: 'x-request-id',
        trustProxy: true,
        logger: (0, logger_plugin_1.getLoggerOptions)(),
        exposeHeadRoutes: false
    });
    // global node js error handlers
    process.on('uncaughtException', (err) => {
        server.log.error(err);
        process.exit(1);
    });
    process.on('unhandledRejection', (err) => {
        server.log.error(err);
        process.exit(1);
    });
    server.register(helmet_1.default);
    server.register(cors_1.default);
    // TODO check why in docker build it fails without "!"
    await (0, swagger_plugin_1.setupSwagger)(server, process.env.SWAGGER_USER, process.env.SWAGGER_PWD);
    // set error handler
    server.setErrorHandler(error_handler_1.errorHandler);
    // set not found handler
    server.setNotFoundHandler((_1, r) => {
        return r.status(404).send(404);
    });
    // set zod req/res validator and serializer
    server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    // load context
    server.decorate('uuid', (0, uuid_service_1.getUUIDService)());
    server.decorate('mailService', (0, sendgrid_service_1.getMailService)(process.env.SENDGRID_API_KEY));
    server.decorate('cryptoService', (0, kms_service_1.getAWSKMSService)(process.env.AWS_REGION, process.env.AWS_KMS_KEY_ID));
    server.decorate('identityService', (0, cognito_service_1.getAWSCognitoService)(process.env.AWS_REGION));
    server.decorate('db', (0, drizzle_service_1.getDb)({
        host: process.env.PGHOST || '',
        port: parseInt(process.env.PGPORT || ''),
        db: process.env.PGDATABASE || '',
        user: process.env.PGUSERNAME || '',
        pwd: process.env.PGPASSWORD || '',
        logsEnabled: process.env.NODE_ENV == 'local'
    }));
    server.decorate('repos', (0, repos_1.getRepos)(server.db));
    server.register(auto_tagging_plugin_1.default);
    // load plugins
    server.register(response_time_plugin_1.default);
    server.register(health_check_plugin_1.default, {
        healthChecksPromises: [
            () => (0, drizzle_service_1.dbHealthCheck)(server.db)
        ],
        path: '/api/health'
    });
    server.register(request_id_plugin_1.default);
    server.register(route_printer_plugin_1.default, {
        skip: ['/api/documentation'],
        logLevel: 'silent'
    });
    server.register(fastify_raw_body_1.default, {
        field: 'rawBody',
        global: true,
        encoding: 'utf8',
        runFirst: true,
        routes: [] // Apply to all routes by default
    });
    // load routes
    server.register(autoload_1.default, {
        dir: path_1.default.join(__dirname, 'routes'),
        ignoreFilter: 'schemas',
        options: {
            prefix: '/api'
        },
        autoHooks: true,
        cascadeHooks: true,
        routeParams: true
    });
    await server.ready();
    console.log(process.env.PORT, process.env.HOST);
    await server.listen({
        port: parseInt(process.env.PORT || ''),
        host: process.env.HOST || ''
    });
}
run();
