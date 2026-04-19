# DevX

DevX is a full-stack developer-focused blogging platform that enables users to write, publish, and engage with technical content. The system is designed with a clean architecture, scalable backend, and a content-first UI inspired by editorial layouts.

---

## Overview

DevX provides a streamlined experience for developers to share knowledge and interact through posts, comments, likes, and bookmarks. The platform emphasizes performance, consistency, and maintainability across both frontend and backend systems.

---

## Features

### Authentication

* JWT-based authentication
* Secure login and registration
* Role-based access control

### Blogging

* Create, edit, and publish posts
* Draft and publish workflows
* Tag-based categorization

### Engagement

* Like and unlike posts
* Bookmark posts
* Comment system

### User System

* Profile page
* User-specific posts
* Bookmarked posts view

---

## Tech Stack

### Frontend

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* React Query
* Axios

### Backend

* Node.js with Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Redis

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Render PostgreSQL

---

## Project Structure

```
frontend/
  ├── app/
  ├── components/
  ├── hooks/
  ├── lib/
  └── types/

backend/
  ├── src/
  │   ├── auth/
  │   ├── blog/
  │   ├── comments/
  │   ├── engagement/
  │   ├── middlewares/
  │   └── config/
```

---

## Getting Started

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=8080
DATABASE_URL=
JWT_SECRET=
REDIS_URL=
```

Run:

```bash
npx prisma migrate dev
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Run:

```bash
npm run dev
```

---

## Deployment

### Backend (Render)

* Configure environment variables
* Run migrations:

```bash
npx prisma migrate deploy
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://<your-backend-url>/api/v1
```

---

## API Overview

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| POST   | /auth/register   | Register user    |
| POST   | /auth/login      | Login            |
| GET    | /auth/me         | Get current user |
| POST   | /blogs           | Create blog      |
| GET    | /blogs           | Get blogs        |
| POST   | /engagement/like | Like a blog      |
| POST   | /comments        | Add comment      |

---

## Design Approach

The interface follows a structured, editorial layout emphasizing:

* strong typographic hierarchy
* grid-based organization
* high information density
* minimal visual noise

---

## Future Improvements

* Notifications
* Follow system
* Rich text editor
* Image uploads
* Recommendation system

---

## Author

Saad Arqam
GitHub: https://github.com/SaadArqam
