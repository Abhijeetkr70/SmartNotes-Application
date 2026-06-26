# SmartNotes Application

A production-grade full-stack note management platform with secure authentication, real-time search, dynamic tag-based categorization, and a responsive UI.

**Live Demo:** [smartnotes-application.vercel.app](https://smartnotes-application.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | Clerk (session-based JWT) |
| **Validation** | Zod |
| **Deployment** | Vercel (client) + Render (server) |

## Features

- **Secure Authentication** — Sign in/up via Google, GitHub, or email with Clerk
- **Full CRUD** — Create, read, update, and delete notes
- **Real-Time Search** — Debounced fuzzy search across titles and body text
- **Tag-Based Categorization** — Add, remove, and filter notes by custom tags
- **Color Coding** — Visual categorization with 8 accent colors
- **Responsive Design** — Mobile-first layout with slide-out sidebar, adaptive grid
- **Dark / Light Theme** — System-aware with manual toggle and localStorage persistence
- **Pagination** — Server-side paginated note retrieval
- **User Isolation** — Each user sees only their own notes

## Project Structure

```
smartnotes-application/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── api/notes.js             # HTTP client with auth token injection
│   │   ├── hooks/useNotes.js        # State management + Clerk auth bridge
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Nav, tags, color picker, theme toggle
│   │   │   ├── NoteCard.jsx         # Note preview card with tag pills
│   │   │   ├── NoteEditor.jsx       # Inline split-view editor
│   │   │   ├── SearchBar.jsx        # Debounced search with Ctrl+K
│   │   │   ├── AuthPage.jsx         # Clerk sign-in page (styled)
│   │   │   ├── EmptyState.jsx       # Contextual empty/not-found states
│   │   │   ├── LoadingSkeleton.jsx  # Animated skeleton grid
│   │   │   └── ErrorBoundary.jsx    # React error boundary
│   │   ├── App.jsx                  # Root layout with auth gating
│   │   └── main.jsx                 # Entry point with ClerkProvider
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json                  # SPA rewrite rules
│
├── server/                          # Express.js backend
│   ├── config/db.js                 # Mongoose connection
│   ├── models/Note.js               # Note schema with userId scoping
│   ├── controllers/notes.js         # CRUD with user isolation
│   ├── routes/notes.js              # RESTful router
│   ├── validation/noteSchema.js     # Zod schemas for POST/PUT
│   ├── middleware/
│   │   ├── auth.js                  # Clerk JWT verification
│   │   └── errorHandler.js          # Centralized error handling
│   └── index.js                     # Express entry point
│
├── DEPLOY.md                        # Production deployment guide
└── package.json                     # Root orchestration
```

## API Endpoints

All `/api/notes` endpoints require `Authorization: Bearer <session_token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | List notes (`?search=&tags=&page=&limit=`) |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `GET` | `/api/health` | Health check (public) |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Clerk account (free at https://clerk.com)

### 1. Clone & Install

```bash
git clone https://github.com/Abhijeetkr70/SmartNotes-Application.git
cd SmartNotes-Application
npm run install-all
```

### 2. Environment Variables

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/smartnotes
CORS_ORIGIN=http://localhost:5173
CLERK_SECRET_KEY=sk_test_...
```

**`client/.env.local`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=/api/notes
```

### 3. Run

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## Deployment

See [DEPLOY.md](./DEPLOY.md) for the full production deployment guide covering:

- **Render** — Web service with Node.js, MongoDB Atlas, Clerk env vars
- **Vercel** — Static SPA with Vite build, API proxy to Render
- **Cron Job** — Keep Render free tier awake via cron-job.org
