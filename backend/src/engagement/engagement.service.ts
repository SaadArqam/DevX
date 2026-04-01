import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

const p: any = prisma;

export const toggleLike = async (blogId: number, userId: number) => {
  // Ensure blog exists (soft-delete middleware will exclude deleted blogs)
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const existing = await p.like.findFirst({ where: { blogId, userId } });

  if (existing) {
    await p.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await p.like.create({ data: { blogId, userId } });
  return { liked: true };
};

export const toggleBookmark = async (blogId: number, userId: number) => {
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const existing = await p.bookmark.findFirst({ where: { blogId, userId } });

  if (existing) {
    await p.bookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }

  await p.bookmark.create({ data: { blogId, userId } });
  return { bookmarked: true };
};

export const getLikeCount = async (blogId: number) => {
  // Ensure blog exists (soft-delete middleware applies)
  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  const count = await p.like.count({ where: { blogId } });
  return count;
};

export const isLikedByUser = async (blogId: number, userId: number) => {
  const exists = await p.like.findFirst({ where: { blogId, userId } });
  return Boolean(exists);
};

export const getUserBookmarks = async (userId: number) => {
  // Fetch bookmarks and include blog; soft-delete middleware will exclude deleted blogs
  const bookmarks = await p.bookmark.findMany({
    where: { userId },
    include: { blog: true },
    orderBy: { createdAt: "desc" },
  });

  // Filter out any bookmarks where blog was removed (safety)
  const data = bookmarks
    .filter((b: any) => b.blog !== null)
    .map((b: any) => ({
      id: b.id,
      createdAt: b.createdAt,
      blog: b.blog,
    }));

  return data;
};
