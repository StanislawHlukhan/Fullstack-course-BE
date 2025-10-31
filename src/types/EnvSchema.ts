import { z } from 'zod';

// DONT USE transform here
// because we are not overwriting process.env
export const EnvSchema = z.object({
  TZ: z.string().optional(),
  NODE_ENV: z.enum(['local', 'staging', 'production']),
  PORT: z.string(),
  HOST: z.string(),
  PGHOST: z.string(),
  PGPORT: z.string(),
  PGUSERNAME: z.string(),
  PGPASSWORD: z.string(),
  PGDATABASE: z.string(),
  SWAGGER_USER: z.string(),
  SWAGGER_PWD: z.string().min(10),
  AWS_REGION: z.string(),
  AWS_USER_POOL_ID: z.string(),
  RESEND_API_KEY: z.string(),
  FROM_EMAIL: z.string(),
  FRONTEND_SIGNUP_URL: z.string(),
  SENDGRID_API_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  REDIS_URL: z.string().optional(),
  WS_HOST: z.string().optional(),
  WS_PORT: z.string().optional()
});

export type Env = z.infer<typeof EnvSchema>;