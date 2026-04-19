export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'AUTHOR' | 'ADMIN';
  postsCount: number;
  likesCount: number;
  followersCount: number;
}

export interface Comment {
  id: string;
  content: string;
  author: { id: string; name: string; username: string; avatar?: string };
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
  deletedAt?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  author: { id: string; name: string; username: string; avatar?: string };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
