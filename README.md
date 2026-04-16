# ✨ CleanConnect — Cleaning Services Marketplace

A modern, mobile-responsive marketplace web app connecting clients with independent cleaning professionals. Built with React 18, TypeScript, Vite, and Tailwind CSS.

![CleanConnect](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat&logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat&logo=vite) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CDN-06B6D4?style=flat&logo=tailwindcss)

---

## 🚀 Quick Start

> **Requires Node.js** — download at [nodejs.org](https://nodejs.org) (LTS recommended)

```bash
# Clone the repo
git clone https://github.com/AquilyaS/sparkle-connect.git
cd sparkle-connect

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Demo Credentials

Use these to explore the app instantly — no sign-up needed:

| Role | Email | Password |
|---|---|---|
| 👤 Client | `john.doe@example.com` | `password123` |
| 👤 Client | `lisa.smith@example.com` | `password123` |
| 🧹 Cleaner | `sarah.johnson@example.com` | `password123` |

All demo accounts and data are seeded automatically on first load via `localStorage`.

---

## 🗺️ Features Overview

### For Clients
| Feature | Description |
|---|---|
| 🔍 Browse & Filter | Search cleaners by location, service type, price, and rating |
| 👤 Cleaner Profiles | Full bios, services/pricing, weekly availability, reviews |
| 📅 Booking Wizard | 3-step flow: service + date/time → address → confirm & pay |
| 📋 My Bookings | Tabs for upcoming/past, cancel bookings, leave reviews |
| ❤️ Favorites | Save cleaners with heart toggle, manage saved list |
| 📊 Dashboard | Stats overview, upcoming bookings, quick actions |

### For Cleaners
| Feature | Description |
|---|---|
| 📥 Booking Requests | Accept or decline incoming bookings |
| 📋 Manage Bookings | Tabs for pending/confirmed/completed/declined |
| ✏️ Edit Profile | Update bio, services, pricing, availability, certifications |
| 💰 Earnings | Monthly bar chart, lifetime stats, per-booking table |
| 📊 Dashboard | Stats overview, pending requests at a glance |

### Platform
- 🔒 Role-based auth (client vs. cleaner) with protected routes
- 📱 Fully mobile-responsive with hamburger navigation
- 🔔 Toast notifications for all actions
- 💾 `localStorage` persistence — data survives page refreshes
- 🎨 Teal brand color system with Tailwind CSS

---

## 🗂️ Project Structure

```
src/
├── App.tsx                    # Root: providers + route tree
├── main.tsx                   # React 18 entry point
├── index.css                  # Base styles
│
├── types/
│   └── index.ts               # All TypeScript interfaces
│
├── data/
│   └── index.ts               # Mock seed data (10 cleaners, 4 clients, 20 bookings, 25 reviews)
│
├── utils/
│   ├── storage.ts             # localStorage helpers + seedIfEmpty()
│   ├── dateHelpers.ts         # Date formatting, availability, time slots
│   └── formatters.ts         # Currency, ratings, labels, colors
│
├── context/
│   ├── AppContext.tsx          # Toast notifications + favorites
│   ├── AuthContext.tsx         # Login / register / logout / session
│   └── BookingContext.tsx      # Booking CRUD + review submission
│
├── hooks/
│   ├── useAuth.ts
│   ├── useBookings.ts
│   └── useApp.ts
│
├── components/
│   ├── ui/                    # Button, Input, Badge, StarRating, Modal, Avatar, Toast, Spinner
│   ├── layout/                # Navbar, Footer, ProtectedRoute
│   ├── cleaners/              # CleanerCard, CleanerFilters
│   ├── booking/               # BookingCard
│   ├── reviews/               # ReviewCard
│   └── dashboard/             # StatsCard
│
└── pages/
    ├── LandingPage.tsx
    ├── BrowsePage.tsx
    ├── CleanerProfilePage.tsx
    ├── LoginPage.tsx
    ├── RegisterPage.tsx
    ├── BookingPage.tsx
    ├── BookingConfirmationPage.tsx
    ├── NotFoundPage.tsx
    ├── client/
    │   ├── ClientDashboard.tsx
    │   ├── ClientBookings.tsx
    │   └── ClientFavorites.tsx
    └── cleaner/
        ├── CleanerDashboard.tsx
        ├── CleanerBookings.tsx
        ├── CleanerProfileEdit.tsx
        └── CleanerEarnings.tsx
```

---

## 🛣️ Route Map

| Route | Page | Access |
|---|---|---|
| `/` | Landing Page | Public |
| `/browse` | Browse Cleaners | Public |
| `/cleaners/:id` | Cleaner Profile | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/book/:cleanerId` | Booking Wizard | Client only |
| `/booking-confirmation` | Booking Confirmed | Client only |
| `/client/dashboard` | Client Dashboard | Client only |
| `/client/bookings` | My Bookings | Client only |
| `/client/favorites` | Saved Cleaners | Client only |
| `/cleaner/dashboard` | Cleaner Dashboard | Cleaner only |
| `/cleaner/bookings` | Manage Bookings | Cleaner only |
| `/cleaner/profile` | Edit Profile | Cleaner only |
| `/cleaner/earnings` | Earnings | Cleaner only |

---

## 🧱 Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [TypeScript 5](https://typescriptlang.org) | Type safety |
| [Vite 5](https://vitejs.dev) | Build tool & dev server |
| [React Router v6](https://reactrouter.com) | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling (via CDN) |
| [Lucide React](https://lucide.dev) | Icon library |
| `localStorage` | Data persistence (no backend) |

---

## 🏗️ Data Model

```typescript
User           → id, email, password, role, firstName, lastName, avatarUrl, location
CleanerProfile → userId, bio, yearsExperience, servicesOffered[], hourlyRate,
                 availability, badges[], averageRating, totalReviews
Booking        → id, clientId, cleanerId, serviceType, scheduledDate, scheduledTime,
                 status, totalAmountCents, paymentStatus
Review         → id, bookingId, clientId, cleanerId, rating, comment
```

Booking statuses: `pending → confirmed → completed` (or `declined` / `cancelled`)

---

## 📦 Available Scripts

```bash
npm run dev       # Start dev server at localhost:5173
npm run build     # TypeScript check + production build
npm run preview   # Preview production build locally
```

---

## 🚀 Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the dist/ folder to netlify.com
```

### GitHub Pages
Add `base: '/sparkle-connect/'` to `vite.config.ts`, then run `npm run build`.

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with ❤️ using Claude Code*
