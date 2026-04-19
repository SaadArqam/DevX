import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function main() {
  console.log("🌱 Seeding database...");

  // Cleanup existing data
  await prisma.bookmark.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.user.deleteMany();

  // ------- Create Users -------
  const adminPassword = await bcrypt.hash("Admin@1234!", BCRYPT_ROUNDS);
  const authorPassword = await bcrypt.hash("Author@5678!", BCRYPT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@devblog.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const author = await prisma.user.create({
    data: {
      name: "Jane Developer",
      email: "jane@devblog.com",
      password: authorPassword,
      role: "AUTHOR",
    },
  });

  console.log(`✅ Created users: ${admin.email}, ${author.email}`);

  // ------- Create Blogs -------
  const blog1 = await prisma.blog.create({
    data: {
      title: "Getting Started with Next.js 14 App Router",
      content: `# Getting Started with Next.js 14 App Router

The App Router is a paradigm shift in how Next.js applications are built...

## Key Features

- Server Components by default
- Nested layouts
- Loading UI and Streaming
- Server Actions

## Setting Up

\`\`\`bash
npx create-next-app@latest my-app --typescript
\`\`\`

Start building your app immediately by editing \`app/page.tsx\`.`,
      published: true,
      authorId: admin.id,
    },
  });

  const blog2 = await prisma.blog.create({
    data: {
      title: "Building Type-Safe APIs with Express and Zod",
      content: `# Building Type-Safe APIs with Express + Zod

Runtime validation is critical for API reliability...

## Why Zod?

Zod provides end-to-end type safety — from your validation schema directly to your TypeScript types.

\`\`\`typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Input = z.infer<typeof schema>;
\`\`\``,
      published: true,
      authorId: admin.id,
    },
  });

  const blog3 = await prisma.blog.create({
    data: {
      title: "PostgreSQL Performance Tuning: Indexes and Query Plans",
      content: `# PostgreSQL Performance Tuning

Understanding indexes is fundamental to database performance...

## Types of Indexes

1. **B-tree** (default) — equality and range queries
2. **Hash** — equality only
3. **GIN** — full-text search, arrays, JSON

## EXPLAIN ANALYZE

Always use \`EXPLAIN ANALYZE\` before creating an index.`,
      published: true,
      authorId: author.id,
    },
  });

  const blog4 = await prisma.blog.create({
    data: {
      title: "JWT Authentication: Access Tokens and Refresh Token Rotation",
      content: `# JWT Authentication Best Practices

Token rotation is essential for security...

## The Flow

1. Login → get access token (15m) + refresh token (7d)
2. Access token expires → use refresh token to get new pair
3. Old refresh token is invalidated immediately
4. On suspected reuse → revoke all sessions`,
      published: true,
      authorId: author.id,
    },
  });

  const blog5 = await prisma.blog.create({
    data: {
      title: "CSS Grid and Flexbox: When to Use Which",
      content: `# CSS Grid vs Flexbox

Both are powerful layout tools but serve different purposes...

## Flexbox

Best for **1-dimensional** layouts (row OR column).

## Grid

Best for **2-dimensional** layouts (rows AND columns).

## Rule of Thumb

Use Flexbox for components, Grid for page layout.`,
      published: true,
      authorId: author.id,
    },
  });

  console.log("✅ Created 5 blog posts");

  // ------- Create Comments -------
  const comment1 = await prisma.comment.create({
    data: {
      content: "Great article! The App Router really changed how I structure my projects.",
      blogId: blog1.id,
      authorId: author.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: "I agree! Especially server components — no more unnecessary client-side JS.",
      blogId: blog1.id,
      authorId: admin.id,
      parentId: comment1.id, // reply to comment1
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: "Zod is a game changer for backend validation. Combined with tRPC it's unbeatable.",
      blogId: blog2.id,
      authorId: author.id,
    },
  });

  console.log("✅ Created 3 comments (1 reply)");

  // ------- Create Likes -------
  await prisma.like.createMany({
    data: [
      { userId: author.id, blogId: blog1.id },
      { userId: author.id, blogId: blog2.id },
      { userId: admin.id, blogId: blog3.id },
      { userId: admin.id, blogId: blog5.id },
    ],
  });

  console.log("✅ Created likes");

  // ------- Create Bookmarks -------
  await prisma.bookmark.createMany({
    data: [
      { userId: author.id, blogId: blog3.id },
      { userId: author.id, blogId: blog4.id },
      { userId: admin.id, blogId: blog5.id },
    ],
  });

  console.log("✅ Created bookmarks");
  console.log("🎉 Seeding complete!");
  console.log("\n📋 Credentials:");
  console.log(`  ADMIN:  admin@devblog.com / Admin@1234!`);
  console.log(`  AUTHOR: jane@devblog.com  / Author@5678!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
