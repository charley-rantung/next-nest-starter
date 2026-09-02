import z from 'zod/v4';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  APP_PORT: z.coerce.number(),
  APP_HOST: z.string(),
  CORS_ALLOWED_ORIGIN: z.string(),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  BCRYPT_SALT_ROUNDS: z.coerce.number(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
});

export type EnvType = z.infer<typeof EnvSchema>;

export const validate = (config: Record<string, any>) => {
  return EnvSchema.parse(config);
};
