/**
 * Queue Configuration
 */

import { z } from "zod";

const QueueConfigSchema = z.object({
  redis: z.object({
    host: z.string(),
    port: z.number().int().positive(),
    password: z.string().optional(),
  }),
  defaultJobOptions: z.object({
    attempts: z.number().int().positive().default(3),
    backoff: z.object({
      type: z.enum(["exponential", "fixed"]).default("exponential"),
      delay: z.number().int().positive().default(2000),
    }),
  }),
  concurrency: z.number().int().positive().default(5),
});

export type QueueConfig = z.infer<typeof QueueConfigSchema>;

export function getQueueConfig(): QueueConfig {
  return QueueConfigSchema.parse({
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD || undefined,
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    },
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || "5"),
  });
}
