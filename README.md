# MigraineTracker GUI

A modern web application for tracking, logging, and analyzing migraine episodes with detailed health metrics and insights.

---

## 🎯 Overview

MigraineTracker GUI helps users monitor their migraine patterns over time with:

- **Calendar view** – Log migraine episodes day by day
- **Episode details** – Track duration, intensity, symptoms, and medications
- **Health metrics** – MIDAS (Migraine Disability Assessment) scoring
- **Analytics dashboard** – Overview of patterns and trends

Built with React 19, TypeScript, and Vite for a responsive, fast experience.

---

## 🏗️ Architecture

### Folder Structure

```text
src/
├── app/
│   ├── components/
│   │   └── organisms/        # App-level components (Navigation, Footer)
│   ├── styles/
│   └── utils/
├── features/                 # Feature modules (self-contained)
│   ├── calendar/             # Migraine logging and calendar view
│   ├── home/                 # Dashboard with analytics cards
│   └── landing-page/         # Authentication entry point
├── shared/
│   ├── api/                  # API communication (axios-based)
│   ├── auth/                 # Google OAuth & session management
│   ├── components/
│   │   └── atoms/            # Reusable UI components
│   ├── constants/            # App-wide constants
│   ├── hooks/                # Custom React hooks
│   ├── routing/              # Route protection logic
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Helper functions
└── main.tsx                  # Entry point
```

### Design Pattern: Atomic Design + Feature-Driven

- **Atoms**: Smallest reusable UI elements (buttons, inputs, dropdowns)
- **Molecules**: Simple component combinations
- **Organisms**: Complete feature sections (Calendar, MigrainePanel, Cards)
- **Features**: Self-contained domain modules with their own context & hooks
- **Shared**: Reusable assets used across multiple features

### How it fits together

1. **Authentication** – Users log in via Google OAuth (handled by backend session cookie)
2. **Home/Dashboard** – Overview cards show MIDAS scores, analytics, and trends
3. **Calendar** – Users select a date and open the MigrainePanel to log details
4. **MigrainePanel** – Form component for capturing duration, intensity, symptoms, medications, and MIDAS data
5. **Data Flow** – All API calls go through `src/shared/api/`, state is managed via React Context providers per feature

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- **Backend API running** – This frontend requires the MigraineTrackerV3 backend to be deployed and accessible

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env with your backend URL and Google OAuth credentials

# Development server
npm run dev

# Production build
npm run build

# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 💻 Technologies

- React 19 – UI framework
- TypeScript – Type safety
- Vite – Build tool & dev server
- React Router – Client-side routing
- Tailwind CSS – Utility-first styling
- Axios – HTTP client for API calls
- Recharts – Data visualization
- Vitest + React Testing Library – Testing

---

## 🔐 Authentication

This application uses Google OAuth for authentication:

- Users are redirected to Google login on the landing page
- Google redirects back with a session token
- Backend sets a secure session cookie
- Protected routes check user context before rendering

Session state is managed via `UserProvider` (React Context) in `src/shared/hooks/user/user-provider.tsx`.

---

## 📊 Key Features

### Calendar Page (`/calendar`)

Interactive calendar to select dates.

Log migraine episodes with:

- Duration – Start/end times (can have multiple episodes per day)
- Intensity – 1–10 scale
- Symptoms – Checkboxes for light sensitivity, noise sensitivity, etc.
- Medications – Add and track medication usage
- MIDAS – Impact on work, chores, and social activities

Additional functionality:

- Edit and update previous entries

### Home Page (`/home`)

- MIDAS Card – Current & previous month comparison
- Statistics cards – Summary metrics
- Trend visualizations – Charts showing patterns over time

---

## ⚙️ CI/CD

GitHub Actions handles:

- Type checking, linting, and unit tests on every PR
- Security audits (`npm audit`)
- Automated releases via `release-please`
- Deployment on version tags
- Automated rollbacks on health check failures

See `.github/workflows/` for implementation details.

---

## 🧪 Testing

Tests are located in the same directories as components (co-located):

```bash
# Run all tests once
npm run test:run

# Watch mode (recommended for development)
npm run test

# Coverage report
npm run test:coverage

# UI mode (interactive test runner)
npm run test:ui
```

---

## 📝 Commit Message Convention

- `feat: xxx` → Minor version (`1.0.0 → 1.1.0`)
- `fix: xxx` → Patch version (`1.0.0 → 1.0.1`)
- `feat!: xxx` → Major version (`1.0.0 → 2.0.0`)
- `chore: xxx` → no release

---

## 🎯 Best Practices

- Keep components small – Each organism should focus on one feature
- Use TypeScript – Define types for all data and props
- Centralize API calls – All fetches in `src/shared/api/`
- Reuse atoms – Use existing atomic components instead of creating new ones
- State management – Use Context + hooks per feature, avoid prop drilling
- Responsive design – Test on mobile, tablet, and desktop

---

## 📚 Resources

- React Documentation
- TypeScript Handbook
- Tailwind CSS Docs
- Vite Guide
- Vitest Docs

---

Part of the MigraineTracker ecosystem – a personal health tracking project combining frontend UI and [backend](https://github.com/iLovePizzaDC/migraineTrackerV3) analytics.
