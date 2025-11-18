// packages/server/src/routers/user.ts
// ------------------------------
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
// 导入共享类型
import { UserProfileOutput } from '@t3-elegance/common';
import { router, publicProcedure } from './trpc';

export const userRouter = router({
  // 示例: 创建一个新用户 (Mutation)
  createUser: publicProcedure
    .input(z.object({ name: z.string().min(2), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      // ctx.prisma 现在可用！
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
        },
      });
      return user; // 返回新创建的用户
    }),

  // 示例: 获取用户详情 (Query)
  getUserDetails: publicProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .output(z.custom<UserProfileOutput>()) // 假设 output 验证器已配置
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: { posts: true }, // 包含用户的帖子
      });

      if (!user) {
         // 使用 tRPC 内建的错误机制
         throw new TRPCError({
           code: 'NOT_FOUND',
           message: 'User not found',
         });
      }

      // 构造符合 UserProfileOutput 的数据
      return {
        success: true,
        data: {
          id: user.id,
          name: user.name ?? 'N/A',
          email: user.email,
          totalPosts: user.posts.length,
        },
      } as UserProfileOutput; // 强制类型转换，因为 Zod 验证已通过
    }),
});





