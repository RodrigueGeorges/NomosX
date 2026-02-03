/**
 * Database Client - Prisma Singleton
 */

const { PrismaClient } = require('../generated/prisma-client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

module.exports = { prisma };
