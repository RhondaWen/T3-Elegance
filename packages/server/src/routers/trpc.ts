// packages/server/src/routers/trpc.ts
// -----------------------------------
// 这个文件定义 tRPC 的基础构建块，避免循环依赖

import { initTRPC } from '@trpc/server';
import { Context } from '../context'; // 导入 context.ts

// 1. 初始化 tRPC 实例，注入 Context
const t = initTRPC.context<Context>().create();

// 2. 导出基础结构
export const router = t.router;
export const publicProcedure = t.procedure;
// 后面可以添加更多的 procedure，如 protectedProcedure

