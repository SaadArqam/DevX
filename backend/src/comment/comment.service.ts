import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";

export class CommentService {
  static async create(blogId: number, userId: number, content: string, parentId?: number) {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new ApiError(404, "Blog not found");

    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent) throw new ApiError(404, "Parent comment not found");
      if (parent.blogId !== blogId) throw new ApiError(400, "Comment belongs to another blog");
    }

    logger.debug({ blogId, userId }, "Creating comment");
    return await prisma.comment.create({
      data: { content, blogId, authorId: userId, parentId },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  static async getCommentsByBlog(blogId: number) {
    const comments = await prisma.comment.findMany({
      where: { blogId, deletedAt: null },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });

    const map = new Map();
    const roots: any[] = [];

    comments.forEach((c: any) => map.set(c.id, { ...c, replies: [] }));
    comments.forEach((c: any) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).replies.push(map.get(c.id));
      } else if (!c.parentId) {
        roots.push(map.get(c.id));
      }
    });

    return roots;
  }

  static async update(commentId: number, userId: number, role: string, content: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new ApiError(404, "Comment not found");

    if (role !== "ADMIN" && comment.authorId !== userId) throw new ApiError(403, "Forbidden");

    logger.debug({ commentId, userId }, "Updating comment");
    return await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  static async softDelete(commentId: number, userId: number, role: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new ApiError(404, "Comment not found");

    if (role !== "ADMIN" && comment.authorId !== userId) throw new ApiError(403, "Forbidden");

    logger.info({ commentId, userId }, "Soft deleting comment");
    await prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });

    return true;
  }
}
