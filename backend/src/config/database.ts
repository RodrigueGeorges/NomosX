/**
 * Database Configuration
 */

import { z } from 'zod';

const DatabaseConfigSchema = z.object({
  url: z.string().url(),
  poolSize: z.number().int().positive().default(10),
  connectionTimeout: z.number().int().positive().default(10000),
  queryTimeout: z.number().int().positive().default(30000),
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

export function getDatabaseConfig(): DatabaseConfig {
  return DatabaseConfigSchema.parse({
    url: process.env.DATABASE_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE || "10"),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || "10000"),
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || "30000"),
  });
}
