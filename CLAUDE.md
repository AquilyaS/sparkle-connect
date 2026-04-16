# CLAUDE.md — CleanConnect / Sparkle Connect

This file gives Claude context about this project so any new session starts with full awareness.

---

## Project Identity

- **App name:** CleanConnect (brand) / sparkle-connect (repo)
- **GitHub:** https://github.com/AquilyaS/sparkle-connect
- **Local path:** `C:\Users\Aquilya\Documents\AI\cleaning-marketplace`
- **Purpose:** Frontend-only marketplace connecting clients with independent cleaning professionals

---

## Tech Stack

| Tool | Version | Notes |
|---|---|---|
| React | 18.3.1 | Functional components, hooks only |
| TypeScript | 5.4.2 | Strict mode, no `any` |
| Vite | 5.2.0 | Dev server on port 5173 |
| React Router | 6.22.3 | `BrowserRouter` in `App.tsx` |
| Tailwind CSS | CDN | Configured inline in `index.html` — no PostCSS/config file |
| Lucide React | 0.344.0 | Import individual icons only |

**No backend.** All data lives in `localStorage`. No database, no API calls, no server.

---

## Architecture

### Provider Stack (in `App.tsx`)
```
BrowserRouter
  └── AppProvider       (toast + favorites)
        └── AuthProvider    (session + user)
              └── BookingProvider  (bookings + reviews)
                    └── AppContent  (Navbar + Routes + Footer + Toast)
```

### Data Flow
```
localStorage (seeded once via seedIfEmpty() in App.tsx useEffect)
  └── Context Providers (hydrate on mount)
        └── Custom Hooks (useAuth, useBookings, useApp)
              └── Pages → Components
```

### Storage Keys
| Key | Contents |
|---|---|
| `cm_users` | Array of User objects |
| `cm_profiles` | Array of CleanerProfile objects |
| `cm_bookings` | Array of Booking objects |
| `cm_reviews` | Array of Review objects |
| `cm_session` | AuthSession (current user) |
| `cm_favorites` | string[] (cleaner user IDs) |
| `cm_seeded` | boolean flag — prevents re-seeding |

---

## Key Files

| File | Purpose |
|---|---|
| `src/types/index.ts` | All TypeScript interfaces — the single source of truth |
| `src/data/index.ts` | Mock seed data (10 cleaners, 4 clients, 20 bookings, 25 reviews) |
| `src/utils/storage.ts` | `get<T>()`, `set<T>()`, `seedIfEmpty()`, CRUD helpers |
| `src/utils/dateHelpers.ts` | Date formatting, `generateNext28Days()`, `getDayOfWeek()`, time slots |
| `src/utils/formatters.ts` | `formatCents()`, `getStatusColorClasses()`, `getBadgeLabel()` |
| `src/context/AuthContext.tsx` | `login()`, `register()`, `logout()`, `updateCurrentUser()` |
| `src/context/BookingContext.tsx` | `createBooking()`, `updateBookingStatus()`, `submitReview()` |
| `src/context/AppContext.tsx` | `showToast()`, `toggleFavorite()`, `isFavorite()` |
| `src/components/layout/ProtectedRoute.tsx` | Role-based route guard |

---

## User Roles

### client
- Browse cleaners, view profiles, book services
- Dashboard: `/client/dashboard`, `/client/bookings`, `/client/favorites`
- Can leave reviews on completed bookings

### cleaner
- Accept/decline booking requests
- Dashboard: `/cleaner/dashboard`, `/cleaner/bookings`, `/cleaner/profile`, `/cleaner/earnings`
- Can edit profile: bio, services, pricing, availability

---

## Demo Accounts (seeded into localStorage)

| Role | Email | Password |
|---|---|---|
| client | john.doe@example.com | password123 |
| client | lisa.smith@example.com | password123 |
| client | michael.clark@example.com | password123 |
| client | amanda.white@example.com | password123 |
| cleaner | sarah.johnson@example.com | password123 |
| cleaner | miguel.rodriguez@example.com | password123 |
| cleaner | emily.chen@example.com | password123 |
| cleaner | james.williams@example.com | password123 |
| cleaner | nina.patel@example.com | password123 |
| cleaner | david.kim@example.com | password123 |

---

## Coding Conventions

- **Tailwind only** — no CSS modules, no styled-components, no extra CSS files
- **No `any` types** — use proper TypeScript interfaces from `src/types/index.ts`
- **Simulated async** — all context mutations use `setTimeout(300–500ms)` to mimic network latency
- **Dates as ISO strings** — never store `Date` objects; always `"YYYY-MM-DD"` strings
- **Prices in cents** — `hourlyRate`, `totalAmountCents`, `basePrice` are all integers in cents
- **Lucide icons** — import individual named icons, e.g. `import { Star } from 'lucide-react'`
- **No index re-exports** — import directly from component files

---

## Booking Status State Machine

```
pending → confirmed   (cleaner accepts)
pending → declined    (cleaner declines)
pending → cancelled   (client cancels)
confirmed → cancelled (client or cleaner cancels)
confirmed → completed (mark as done)
```

Only valid transitions are offered as UI actions in `BookingCard.tsx`.

---

## Adding New Features — Checklist

1. **New type?** → Add interface to `src/types/index.ts`
2. **New data?** → Add to `src/data/index.ts` + update `seedIfEmpty()` in `src/utils/storage.ts`
3. **New context action?** → Add to the relevant context + expose via its hook
4. **New page?** → Create in `src/pages/`, add route in `src/App.tsx`
5. **New protected page?** → Wrap with `<ProtectedRoute allowedRole="client|cleaner" />` in `App.tsx`
6. **After changes?** → Commit and push to `https://github.com/AquilyaS/sparkle-connect`

---

## Running the Project

```bash
cd "C:\Users\Aquilya\Documents\AI\cleaning-marketplace"
npm install      # first time only
npm run dev      # http://localhost:5173
```

**Node.js required** — download from https://nodejs.org (LTS version).

---

## Git Workflow

```bash
git add .
git commit -m "your message"
git push origin main
```

Remote: `https://github.com/AquilyaS/sparkle-connect.git`
