# Missing Features Design — Idea Incubator Platform
**Date:** 2026-04-21  
**Status:** Approved

## Overview

Add 5 missing feature sets to the existing MERN Idea Incubator platform. All features follow a vertical-slice approach: each is implemented end-to-end (backend + frontend) before moving to the next, with a GitHub push after each.

---

## Feature Order

1. Roles + Skills/Interests
2. Collaboration Requests
3. Tasks
4. Updates & Mentor Feedback
5. Admin Panel

---

## 1. Data Models

### User model (extend existing)
- `role`: enum `['student', 'mentor', 'admin']`, default `'student'`
- `skills`: `[String]`, default `[]`
- `interests`: `[String]`, default `[]`

### CollaborationRequest (new collection)
```
_id, idea (ref Idea), requester (ref User), message (String),
status (enum: pending/approved/rejected, default: pending), timestamps
```

### Task (new collection)
```
_id, idea (ref Idea), title (String, required), description (String),
assignedTo (ref User), status (enum: todo/in-progress/done, default: todo),
deadline (Date), timestamps
```

### Update (new collection)
```
_id, idea (ref Idea), author (ref User),
message (String, required),
type (enum: update/feedback, default: update),
timestamps
```
- `type: feedback` is restricted to mentors only on the backend.
- Comments model unchanged — used for general discussion.

---

## 2. API Endpoints

### User / Auth (extending existing)
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| PUT | `/api/users/profile` | user | Now accepts `skills`, `interests`; `role` field ignored unless admin |
| GET | `/api/users/:id` | public | Now returns `role`, `skills`, `interests` |

### Collaboration Requests
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/ideas/:id/requests` | student | Submit join request; blocked if already member/owner |
| GET | `/api/ideas/:id/requests` | owner | List all requests for idea |
| PATCH | `/api/ideas/:id/requests/:requestId` | owner | Approve → adds to `idea.collaborators`; Reject → status update only |
| GET | `/api/users/my-requests` | user | See own outgoing requests and their statuses |

### Tasks
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/ideas/:id/tasks` | member/owner | List tasks |
| POST | `/api/ideas/:id/tasks` | owner | Create task, assign to team member |
| PATCH | `/api/ideas/:id/tasks/:taskId` | member/owner | Update status or assignee |
| DELETE | `/api/ideas/:id/tasks/:taskId` | owner | Delete task |

### Updates & Feedback
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/ideas/:id/updates` | public | List all updates and feedback |
| POST | `/api/ideas/:id/updates` | member/owner/mentor | `type: update` for team; `type: feedback` for mentors only |
| DELETE | `/api/ideas/:id/updates/:updateId` | author/admin | Delete own or admin deletes any |

### Admin
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/admin/users` | admin | List all users |
| PATCH | `/api/admin/users/:id/role` | admin | Change any user's role |
| DELETE | `/api/admin/users/:id` | admin | Delete user |
| DELETE | `/api/admin/ideas/:id` | admin | Delete any idea |

---

## 3. Authorization Rules

- **Admin middleware:** checks `req.user.role === 'admin'`
- **Mentor check:** inline check `req.user.role === 'mentor'` in updates controller
- **Member check:** helper that checks if user is `idea.author` or in `idea.collaborators`
- No changes to existing `protect` middleware

---

## 4. Frontend Changes

### Profile Page (`/profile/:id`)
- Role badge next to username (color-coded: blue=student, green=mentor, red=admin)
- Skills and interests shown as tags; editable in own profile (type + Enter to add, click × to remove)
- Role shown as read-only text in edit mode (admin can change via admin panel)

### Idea Detail Page (`/ideas/:id`) — tabbed layout
Add three tabs below the idea description:
- **Collaboration tab:** "Request to Join" button (non-members); pending requests list with Approve/Reject (owner only); approved team member list (all)
- **Tasks tab:** task list with status badges; "Add Task" form (owner only); status dropdown for each task (members + owner); assignee shown per task
- **Updates tab:** chronological feed of updates and mentor feedback; "Post Update" form (members + owner); mentor feedback rendered with distinct styling; all users can read

### Admin Page (`/admin`)
- Route protected: redirects non-admins to home
- User table: name, email, role badge, change-role dropdown, delete button
- Idea list below: title, author, delete button
- Linked from navbar (admin only, next to username)

### Navbar
- Role badge shown next to username when logged in
- "Admin" link shown only when `user.role === 'admin'`

---

## 5. Implementation Order & Git Strategy

Each feature is a separate backend + frontend slice, committed and pushed to GitHub on completion:

1. **Feature: roles-skills** — User schema update, profile UI update
2. **Feature: collab-requests** — CollaborationRequest model + routes + Collaboration tab
3. **Feature: tasks** — Task model + routes + Tasks tab
4. **Feature: updates-feedback** — Update model + routes + Updates tab
5. **Feature: admin-panel** — Admin routes + Admin page + navbar link

---

## 6. Out of Scope (for this implementation)

- Real-time chat or notifications
- AI-based idea recommendations
- Email notifications
- GitHub repository integration
- Skill-based collaborator matching algorithm
