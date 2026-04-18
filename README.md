# Smart Research Collaboration & Idea Incubator Platform

A full-stack MERN application where college students can submit research/startup ideas, collaborate, and connect.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router DOM, Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

## Setup

### Backend
```bash
cd backend
npm install
# Configure .env (copy .env.example and fill in values)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- [x] User registration & login (JWT)
- [x] Submit, browse, edit, delete ideas
- [x] Express interest / collaborate on ideas
- [x] Comment on ideas
- [x] User profiles
- [x] Search & filter by category/tags
- [x] Protected routes
