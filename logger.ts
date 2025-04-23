import pino from 'pino';
import { EnvSchema } from './schemas';
const env = EnvSchema.parse(process.env);
export const logger = pino({ level: env.LOG_LEVEL });