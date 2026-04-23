# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Research Collaboration & Idea Incubator — a monolithic MERN stack platform where college students submit research/startup ideas, express interest, collaborate, and comment. Express backend and React frontend live in one repo; Express serves the React build in production.

## Commands

```bash
npm run install-all   # install root deps + client deps
npm run dev           # run backend (nodemon) + frontend (Vite) concurrently
npm run build         # build React into client/dist
npm start             # production: node server.js (serves API + static frontend)
```

**Frontend only** (`cd client`):
```bash
npm run dev           # Vite dev server at http://localhost:5173
npm run lint          # ESLint
npm run build         # Vite production build → client/dist/
```

**Docker** (production, builds frontend inside image):
```bash
JWT_SECRET=<secret> docker compose up --build
```

## Environment

Copy `.env.example` → `.env` at the root:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/idea-incubator
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

No `client/.env` is required — the axios instance defaults to `/api` which the Vite dev proxy forwards to `localhost:5000`, and in production Express handles it on the same origin. Set `VITE_API_URL` in `client/.env` only if you need to override (e.g. a remote backend).

## Architecture

### Backend (root level)
CommonJS Node.js/Express 5. Entry point: `server.js`.

```
server.js           → mounts routes, CORS, global errorHandler; serves client/dist in production
config/db.js        → Mongoose connection (supports Atlas + local)
models/             → User, Idea, Comment (Mongoose schemas)
routes/             → authRoutes, ideaRoutes, commentRoutes, userRoutes
controllers/        → business logic per resource
middleware/         → protect (JWT auth), errorHandler
validators/         → express-validator chains (authValidator, ideaValidator)
utils/generateToken.js → signs JWT (7d expiry)
```

API prefix: `/api/*`. Health check: `GET /api/health`.

**Auth flow**: `protect` middleware extracts Bearer token from `Authorization` header, verifies with `JWT_SECRET`, attaches `req.user` (password excluded). All mutation routes require `protect`.

**Idea model** key fields: `author` (ref User), `collaborators[]`, `interestedUsers[]`, `status` (open/in-progress/completed), `category` enum (Tech/Business/Social/Science/Art/Other), `tags[]`.

### Frontend (`client/src/`)
React 19 + Vite. Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js`).

```
main.jsx            → React root
App.jsx             → BrowserRouter, route definitions, Layout wrapper
pages/              → one file per route
components/
  layout/           → Navbar, Footer
  common/           → ProtectedRoute, Modal, SearchBar, Spinner
  idea/             → IdeaCard, IdeaForm, IdeaList
  comment/          → CommentItem, CommentSection
store/
  authStore.js      → Zustand (persisted to localStorage): user, token, isAuthenticated
  ideaStore.js      → Zustand: ideas list, pagination, filters
api/axiosInstance.js → axios; baseURL defaults to /api; injects Bearer token; redirects to /login on 401
hooks/
  useAuth.js        → register, login, logout, fetchMe wired to authStore
  useIdeas.js       → CRUD + toggleInterest wired to ideaStore
```

**Routing**: Public routes (`/`, `/profile/:id`), auth-redirect routes (`/login`, `/register`), protected routes wrapped in `<ProtectedRoute>` (`/dashboard`, `/ideas/*`).

**Forms**: Formik + Yup for all user-facing forms (auth pages, idea create/edit).

### Dev vs Production
| | Dev (`npm run dev`) | Production (`npm start` / Docker) |
|---|---|---|
| Frontend served by | Vite on :5173 | Express static from `client/dist` |
| API calls | Vite proxy `/api` → `:5000` | Same-origin `/api` on `:5000` |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Not needed (same origin) |
