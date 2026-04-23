# Smart Research Collaboration & Idea Incubator Platform

A full-stack MERN application where college students can submit research/startup ideas, collaborate, and connect.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router DOM, Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

## Project Structure

```
idea-incubator/
├── server.js           # Express entry point
├── package.json        # Root package (backend deps + dev scripts)
├── config/             # Database connection
├── controllers/        # Route handlers
├── middleware/         # Auth & error middleware
├── models/             # Mongoose schemas (User, Idea, Comment)
├── routes/             # Express routers
├── validators/         # express-validator chains
├── utils/              # JWT helper
└── client/             # React frontend (Vite)
    └── src/
        ├── pages/
        ├── components/
        ├── store/      # Zustand state
        ├── hooks/      # useAuth, useIdeas
        └── api/        # axios instance
```

## Setup

### 1. Install dependencies

```bash
npm run install-all
```

### 2. Configure environment

```bash
# Root – backend config
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, etc.
```

### 3. Run in development

```bash
npm run dev
# Backend:  http://localhost:5000
# Frontend: http://localhost:5173
```

### 4. Build & run in production

```bash
npm run build   # builds React into client/dist
npm start       # Express serves API + static frontend on port 5000
```

### Docker (production)

```bash
JWT_SECRET=<secret> docker compose up --build
# App available at http://localhost:5000
```

## Features
- [x] User registration & login (JWT)
- [x] Submit, browse, edit, delete ideas
- [x] Express interest / collaborate on ideas
- [x] Comment on ideas
- [x] User profiles
- [x] Search & filter by category/tags
- [x] Protected routes
