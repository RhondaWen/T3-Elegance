// packages/server/src/routers/_app.ts
// -----------------------------------
// 这个文件合并所有子路由，创建主 appRouter

import { router } from './trpc'; // 从 trpc.ts 导入基础构建块

// 导入子路由
import { userRouter } from './user';

// 合并所有子路由
export const appRouter = router({
  user: userRouter, // 挂载 user.ts 中的路由
  // 未来可以添加 post: postRouter 等
});

// 导出 AppRouter 类型供前端使用
export type AppRouter = typeof appRouter;