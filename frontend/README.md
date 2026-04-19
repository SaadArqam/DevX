# DevBlog Frontend

A modern, clean, and highly responsive UI for a developer-focused social blogging platform inspired by X (Twitter) and Reddit.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** with custom dark theme
- **React Query** (TanStack Query) for data fetching
- **Lucide React** for icons
- **Zustand** for state management

## Features

### Core UI Components
- **3-Column Layout**: Left sidebar navigation, main content feed, right panel with suggestions
- **PostCard**: Clean, minimal post cards with engagement metrics
- **PostDetail**: Full post view with nested comments
- **CreatePost**: Modal-based post creation with real-time character counting
- **Skeleton Loaders**: Smooth loading states instead of spinners

### Design System
- **Dark Theme First**: Primary dark theme with carefully selected color palette
- **Minimal & Clean**: Content-first layout avoiding visual clutter
- **Smooth Interactions**: Hover effects, transitions, and micro-animations
- **Responsive Design**: Mobile-optimized with collapsible sidebar

### UX Features
- **Optimistic Updates**: Instant feedback for likes, bookmarks, and comments
- **Infinite Scroll**: Seamless content loading (ready for implementation)
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Component Reusability**: Modular, composable component architecture

## Project Structure

```
src/
- app/                    # Next.js App Router
  - globals.css          # Global styles and Tailwind configuration
  - layout.tsx           # Root layout with providers
  - page.tsx             # Home feed page
  - providers.tsx        # React Query providers
  - blog/[id]/           # Dynamic blog post pages
- components/
  - blog/                # Blog-specific components
    - PostCard.tsx
    - PostCardSkeleton.tsx
    - CreatePost.tsx
  - layout/              # Layout components
    - Layout.tsx
    - Sidebar.tsx
  - ui/                  # Reusable UI components
    - Skeleton.tsx
- hooks/                 # Custom React hooks
  - api.ts              # React Query hooks for API calls
- lib/                   # Utility functions
  - utils.ts            # Helper functions
- types/                 # TypeScript type definitions
  - index.ts            # Core application types
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

The frontend is configured to work with a backend API running on `localhost:3001`. Update the `next.config.js` if your backend runs on a different port.

## API Integration

The application uses React Query for data fetching with the following endpoints:

- `GET /api/v1/blogs` - Fetch all blog posts
- `GET /api/v1/blogs/:id` - Fetch single blog post
- `POST /api/v1/blogs` - Create new blog post
- `POST /api/v1/blogs/:id/like` - Like a blog post
- `POST /api/v1/blogs/:id/bookmark` - Bookmark a blog post
- `POST /api/v1/blogs/:id/comments` - Add comment to blog post

### Optimistic Updates

All user interactions (likes, bookmarks, comments) use optimistic updates for instant feedback:

```typescript
// Example: Like functionality
const likeBlogMutation = useMutation({
  mutationFn: (blogId: number) => apiRequest(`/blogs/${blogId}/like`),
  onMutate: async (blogId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['blogs'] })
    
    // Snapshot previous value
    const previousBlogs = queryClient.getQueryData(['blogs'])
    
    // Optimistically update
    queryClient.setQueryData(['blogs'], (old: Blog[]) =>
      old?.map(blog => 
        blog.id === blogId 
          ? { ...blog, likes: [...blog.likes, newLike] }
          : blog
      )
    )
    
    return { previousBlogs }
  },
  onError: (err, blogId, context) => {
    // Rollback on error
    queryClient.setQueryData(['blogs'], context.previousBlogs)
  }
})
```

## Design Principles

### Color Palette
- **Background**: `slate-900` (#0f172a)
- **Cards**: `slate-800` (#1e293b) 
- **Borders**: `slate-700` (#334155)
- **Primary**: `blue-500` for interactive elements
- **Text**: `slate-100` for primary, `slate-400` for secondary

### Typography
- Clean sans-serif (Inter font)
- Clear hierarchy with proper font weights
- Consistent spacing and line heights

### Animations
- Subtle scale transforms on hover
- Smooth color transitions
- Fade-in animations for content
- Skeleton loading states

## Component Examples

### PostCard Component
```typescript
<PostCard 
  blog={blogData}
  className="hover-lift hover-glow"
/>
```

Features:
- Author avatar and metadata
- Optimistic like/bookmark buttons
- Comment count display
- Hover effects and smooth transitions
- Click-to-navigate functionality

### CreatePost Modal
```typescript
<CreatePost 
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```

Features:
- Real-time character counting
- Form validation
- Loading states
- Backdrop blur effect
- Smooth open/close animations

## Performance Optimizations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component ready
- **Caching**: React Query with 5-minute stale time
- **Bundle Optimization**: Tree-shaking with ES modules

## Development Notes

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/` for src/)
- Next.js types included

### Tailwind CSS
- Custom dark theme configuration
- Component utility classes
- Responsive design utilities
- Animation keyframes defined

### React Query Setup
- Query client with default options
- DevTools enabled in development
- Error boundaries and retry logic
- Optimistic update patterns

## Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Advanced search and filtering
- [ ] User authentication flow
- [ ] Rich text editor for posts
- [ ] Image upload functionality
- [ ] Notification system
- [ ] User profiles and settings
- [ ] Tag system and categorization

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test responsive design on multiple screen sizes
5. Write meaningful commit messages

## License

This project is licensed under the MIT License.
