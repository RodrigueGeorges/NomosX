/**
 * Structured Logger - Production-grade logging with Pino
 */

import pino from "pino";

export interface LoggerConfig {
  service: string;
  level?: string;
  pretty?: boolean;
}

export interface Logger {
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, context?: Record<string, any>): void;
  debug(message: string, context?: Record<string, any>): void;
  child(bindings: Record<string, any>): Logger;
}

class PinoLogger implements Logger {
  private logger: pino.Logger;

  constructor(config: LoggerConfig) {
    const options: pino.LoggerOptions = {
      level: config.level || process.env.LOG_LEVEL || "info",
      base: {
        service: config.service,
        env: process.env.NODE_ENV || "development",
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    };

    // Pretty print in development
    if (config.pretty || process.env.NODE_ENV === "development") {
      this.logger = pino({
        ...options,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      });
    } else {
      this.logger = pino(options);
    }
  }

  info(message: string, context?: Record<string, any>): void {
    this.logger.info(context || {}, message);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.logger.warn(context || {}, message);
  }

  error(message: string, context?: Record<string, any>): void {
    this.logger.error(context || {}, message);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.logger.debug(context || {}, message);
  }

  child(bindings: Record<string, any>): Logger {
    const childLogger = this.logger.child(bindings);
    return {
      info: (msg, ctx) => childLogger.info(ctx || {}, msg),
      warn: (msg, ctx) => childLogger.warn(ctx || {}, msg),
      error: (msg, ctx) => childLogger.error(ctx || {}, msg),
      debug: (msg, ctx) => childLogger.debug(ctx || {}, msg),
      child: (b) => this.child({ ...bindings, ...b }),
    };
  }
}

export function createLogger(config: LoggerConfig): Logger {
  return new PinoLogger(config);
}
