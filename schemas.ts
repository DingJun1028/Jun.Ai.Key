import { z } from 'zod';
export const ConfigSchema = z.object({
  dataMapping: z.record(z.string(), z.string()),
});
export const EnvSchema = z.object({
  BOOST_API_KEY: z.string().min(1),
  BOOST_SPACE_URL: z.string().url(),
  BOOST_SPACE_TABLE_ID: z.string().min(1),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});