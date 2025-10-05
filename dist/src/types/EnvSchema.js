"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
const zod_1 = require("zod");
// DONT USE transform here
// because we are not overwriting process.env
exports.EnvSchema = zod_1.z.object({
    TZ: zod_1.z.string().optional(),
    NODE_ENV: zod_1.z.enum(['local', 'staging', 'production']),
    PORT: zod_1.z.string(),
    HOST: zod_1.z.string(),
    PGHOST: zod_1.z.string(),
    PGPORT: zod_1.z.string(),
    PGUSERNAME: zod_1.z.string(),
    PGPASSWORD: zod_1.z.string(),
    PGDATABASE: zod_1.z.string(),
    SWAGGER_USER: zod_1.z.string(),
    SWAGGER_PWD: zod_1.z.string().min(10),
    AWS_REGION: zod_1.z.string(),
    AWS_USER_POOL_ID: zod_1.z.string(),
    RESEND_API_KEY: zod_1.z.string(),
    FROM_EMAIL: zod_1.z.string(),
    FRONTEND_SIGNUP_URL: zod_1.z.string(),
    SENDGRID_API_KEY: zod_1.z.string(),
    STRIPE_SECRET_KEY: zod_1.z.string(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string(),
    FRONTEND_URL: zod_1.z.string()
});
