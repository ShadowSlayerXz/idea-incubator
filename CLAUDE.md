# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Research Collaboration & Idea Incubator — a MERN stack platform where college students submit research/startup ideas, express interest, collaborate, and comment. Two independent apps: `backend/` (Express API) and `frontend/` (React SPA).

## Commands

### Backend (`cd backend`)
```bash
npm install
npm run dev      # nodemon server.js (hot-reload)
npm start        # node server.js (production)
```

### Frontend (`cd frontend`)
```bash
npm install
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Docker (backend + MongoDB together)
```bash
JWT_SECRET=<secret> docker compose up
```
The frontend is not containerized — run it separately with `npm run dev`.

## Environment

**Backend** — copy `backend/.env.example` to `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/idea-incubator
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

**Frontend** — create `frontend/.env` with:
```
VITE_API_URL=        # leave empty in dev; Vite proxies /api → localhost:5000
```
In production set `VITE_API_URL` to the backend base URL.

## Architecture

### Backend (`backend/`)
CommonJS Node.js/Express 5. Entry point: `server.js`.

```
server.js           → mounts routes, CORS (CLIENT_ORIGIN), global errorHandler
config/db.js        → Mongoose connection
models/             → User, Idea, Comment (Mongoose schemas)
routes/             → authRoutes, ideaRoutes, commentRoutes, userRoutes
controllers/        → business logic per resource
middleware/         → protect (JWT auth), errorHandler
validators/         → express-validator chains (authValidator, ideaValidator)
utils/generateToken.js → signs JWT
```

API prefix: `/api/*`. Health check: `GET /api/health`.

**Auth flow**: `protect` middleware extracts Bearer token, verifies with `JWT_SECRET`, attaches `req.user` (password excluded). All mutation routes use `protect`.

**Idea model** key fields: `author` (ref User), `collaborators[]`, `interestedUsers[]`, `status` (open/in-progress/completed), `category` enum, `tags[]`.

### Frontend (`frontend/src/`)
React 19 + Vite. Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed).

```
main.jsx            → React root
App.jsx             → BrowserRouter, route definitions, Layout wrapper
pages/              → one file per page/route
components/
  layout/           → Navbar, Footer
  common/           → ProtectedRoute, shared UI
  idea/             → idea-specific components
  comment/          → comment components
store/
  authStore.js      → Zustand (persisted): user, token, isAuthenticated; login/logout/updateUser
  ideaStore.js      → Zustand: ideas list state
api/axiosInstance.js → axios with VITE_API_URL base; injects Bearer token; redirects to /login on 401
hooks/
  useAuth.js        → auth-related logic
  useIdeas.js       → idea fetching/mutation logic
```

**Routing**: Public routes (`/`, `/profile/:id`), auth-redirect routes (`/login`, `/register`), and protected routes wrapped in `<ProtectedRoute>` (`/dashboard`, `/ideas/*`).

**State**: Auth state is persisted to `localStorage` via Zustand `persist` middleware (key `auth-storage`). Token is also stored separately under key `token` for the axios interceptor.

**Forms**: Formik + Yup for validation on auth and idea forms.
