// packages/server/src/context.ts
// ------------------------------
import { PrismaClient } from '@prisma/client';
import * as trpcExpress from '@trpc/server/adapters/express';

// 使用全局对象实现单例模式，防止开发环境中热重载导致创建多个 PrismaClient 实例
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn'] // 仅在开发环境记录 SQL 查询
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 定义 Express 请求上下文的类型 (用于 tRPC)
export type CreateContextOptions = {
  req: trpcExpress.CreateExpressContextOptions['req'];
  res: trpcExpress.CreateExpressContextOptions['res'];
};

// 导出创建上下文的函数，将 Prisma 客户端注入
export function createContext({ req, res }: CreateContextOptions) {
  return {
    req,
    res,
    prisma, // <-- 注入 Prisma 客户端
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;