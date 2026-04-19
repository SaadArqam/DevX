import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Blog, Comment, User, PaginatedResponse, ApiResponse } from '@/types';

// --- Blogs ---

export const useBlogs = (search?: string, tag?: string) => {
  return useInfiniteQuery({
    queryKey: ['blogs', { search, tag }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get('/blogs', {
        params: { page: pageParam, limit: 10, search, tag },
      });
      return res.data; // { success, message, data: Blog[], meta: {...} }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNext) return lastPage.meta.page + 1;
      return undefined;
    },
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Blog>>(`/blogs/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Blog>) => {
      const res = await api.post<ApiResponse<Blog>>('/blogs', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useUpdateBlog = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Blog>) => {
      const res = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.removeQueries({ queryKey: ['blog', id] });
    },
  });
};

export const useLikeBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<ApiResponse<Blog>>(`/blogs/${id}/like`);
      return res.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['blog', id] });
      const previousBlog = queryClient.getQueryData<Blog>(['blog', id]);
      
      if (previousBlog) {
        queryClient.setQueryData<Blog>(['blog', id], {
          ...previousBlog,
          isLiked: !previousBlog.isLiked,
          likesCount: previousBlog.isLiked ? previousBlog.likesCount - 1 : previousBlog.likesCount + 1,
        });
      }
      return { previousBlog };
    },
    onError: (err, id, context) => {
      if (context?.previousBlog) {
        queryClient.setQueryData(['blog', id], context.previousBlog);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useBookmarkBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<ApiResponse<Blog>>(`/blogs/${id}/bookmark`);
      return res.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['blog', id] });
      const previousBlog = queryClient.getQueryData<Blog>(['blog', id]);
      
      if (previousBlog) {
        queryClient.setQueryData<Blog>(['blog', id], {
          ...previousBlog,
          isBookmarked: !previousBlog.isBookmarked,
        });
      }
      return { previousBlog };
    },
    onError: (err, id, context) => {
      if (context?.previousBlog) {
        queryClient.setQueryData(['blog', id], context.previousBlog);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

// --- Comments ---

export const useComments = (blogId: string) => {
  return useQuery({
    queryKey: ['comments', blogId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Comment[]>>(`/blogs/${blogId}/comments`);
      return res.data.data;
    },
    enabled: !!blogId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ blogId, content, parentId }: { blogId: string; content: string; parentId?: string }) => {
      const res = await api.post<ApiResponse<Comment>>(`/blogs/${blogId}/comments`, { content, parentId });
      return res.data.data;
    },
    onSuccess: (data, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] }); // Update commentsCount
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, blogId }: { id: string; blogId: string }) => {
      await api.delete(`/comments/${id}`);
    },
    onSuccess: (data, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
    },
  });
};

// --- Profile ---

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ user: User; blogs: PaginatedResponse<Blog>; bookmarkedBlogs: PaginatedResponse<Blog> }>>(`/users/${userId}/profile`);
      return res.data.data;
    },
    enabled: !!userId,
  });
};
