import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  return new PrismaClient();
}

/** Dev-də schema dəyişəndən sonra köhnə keşlənmiş client-i atır */
function getPrismaClient() {
  const cached = globalForPrisma.prisma;
  if (
    cached &&
    typeof cached.contactContent !== 'undefined' &&
    typeof cached.studentUser !== 'undefined'
  ) {
    return cached;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrismaClient();
