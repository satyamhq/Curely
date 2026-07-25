# AGENTS.md — Curely

This file gives coding agents (Claude Code, etc.) the context needed to work in this repo correctly. Read this before making changes.

## Project Summary

Curely is a healthcare marketplace ("Zomato for Healthcare + AI Health Assistant") connecting patients with doctors, pharmacies, and diagnostic labs, plus an AI symptom checker. Five user roles: `patient`, `doctor`, `pharmacy`, `lab`, `admin`.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router, TypeScript |
| Styling | Tailwind CSS + shadcn/ui, "Modern Minimal" theme (`21st.dev/@serafimcloud/themes/modern-minimal`) |
| Auth/DB | Supabase (Postgres + Auth + RLS + Storage + Realtime) |
| AI | OpenAI API (symptom checker, doctor matching, chat assistant) |
| Payments | Razorpay (primary, India) or Stripe |
| Deployment | Vercel |
| Forms/Validation | react-hook-form + zod |
| State | React Server Components + Zustand (client cart/UI state) |

## Setup & Commands

```bash
npm install
npm run dev          # local dev server
npm run build         # production build — must pass with zero TS errors before any phase is "done"
npm run lint
supabase db push      # apply migrations in supabase/migrations/
supabase gen types typescript --local > types/database.types.ts
```

## Environment Variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, NEVER expose to client or commit real value
OPENAI_API_KEY=                   # server-only
NEXT_PUBLIC_SITE_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Keep `.env.example` in sync with the same keys (blank values). Never overwrite existing `.env.local` values when scaffolding. Never log, print, or hardcode secret keys anywhere in source.

## Folder Structure Conventions

```
app/
  (auth)/            # login, signup, role selection, oauth callback
  (patient)/         # dashboard, symptom-checker, doctors, appointments,
                      # pharmacy, cart, checkout, orders, labs, lab-bookings,
                      # health-records, profile
  (doctor)/doctor-dashboard/
  (pharmacy)/pharmacy-dashboard/
  (lab)/lab-dashboard/
  (admin)/admin/
  api/               # route handlers: ai/*, appointments, orders,
                      # lab-bookings, payments, notifications

components/
  ui/                # shadcn primitives only — do not hand-roll these
  layout/            # Navbar, Footer, Sidebar, MobileNav
  shared/            # DoctorCard, PharmacyCard, LabCard, AppointmentCard,
                      # ReviewList, SearchBar, FilterPanel, RatingStars
  ai/                # SymptomChecker, AIChatWidget, DoctorRecommendations
  booking/           # BookingCalendar, TimeSlotPicker, BookingConfirmation
  dashboards/{doctor,pharmacy,lab}/

lib/                 # openai.ts, constants.ts, validations/ (zod schemas), utils.ts
utils/supabase/      # client.ts, server.ts, middleware.ts
types/                # database.types.ts (generated) + per-entity types
hooks/                # useAuth, useDoctors, useAppointments, useCart
supabase/
  migrations/         # numbered SQL files, applied in order
  seed.sql
```

Route groups map 1:1 to roles — `(patient)`, `(doctor)`, `(pharmacy)`, `(lab)`, `(admin)`. Do not mix role-specific pages into the wrong group.

## Database Schema (Supabase/Postgres)

Core tables: `profiles`, `doctors`, `doctor_availability`, `pharmacies`, `medicines`, `labs`, `lab_tests`, `appointments`, `consultations`, `orders`, `order_items`, `lab_bookings`, `lab_reports`, `health_records`, `reviews`, `notifications`, `payments`.

Rules when touching schema:
- Every new table needs an RLS policy in the same PR/change as the table itself — never ship a table without RLS.
- Patients may only read/write their own rows (`patient_id = auth.uid()` or via `profiles`).
- Doctors/pharmacies/labs may only read/write rows tied to their own `profile_id`.
- Admins bypass RLS via `service_role` — never via a client-side role check.
- Regenerate `types/database.types.ts` after any schema change: `supabase gen types typescript --local > types/database.types.ts`.
- Migrations are additive and numbered sequentially (`000N_description.sql`); never edit a migration that has already been applied — write a new one.

## Build Phases

This project is built in 10 sequential phases (see `curely-build-plan.md` for the full prompts). Work one phase at a time; confirm `npm run dev` and `npm run build` succeed before moving to the next:

1. Project scaffold & config
2. Database schema, migrations & RLS
3. Authentication & role-based routing
4. Core layout & shared UI
5. AI symptom checker & doctor matching
6. Doctor discovery & appointment booking
7. Pharmacy marketplace & orders
8. Diagnostic labs module
9. Doctor dashboard & health records
10. Admin, notifications, polish & deploy

Do not skip ahead to a later phase's work (e.g. payments UI) while implementing an earlier phase, even if it seems convenient — later phases depend on earlier ones being stable.

## Coding Conventions

- TypeScript strict mode; no `any` without justification.
- All forms use `react-hook-form` + `zod` resolvers; schemas live in `lib/validations/`.
- Server-only secrets (`SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `RAZORPAY_KEY_SECRET`) are only referenced inside `app/api/**/route.ts` or other server contexts — never in client components.
- Use `utils/supabase/server.ts` in Server Components/route handlers and `utils/supabase/client.ts` in Client Components. Never mix them.
- Prefer Server Components by default; mark `"use client"` only when interactivity (state, effects, event handlers) requires it.
- Cart/UI-only client state goes in Zustand (`hooks/useCart.ts`); server data goes through Supabase, not client state.
- New shared UI goes in `components/shared/`, typed against `types/`; don't duplicate card/list components inside individual pages.
- Every list view needs a loading state, an error state, and an empty state — this isn't optional polish, add it as you build the page, not just in Phase 10.

## AI Endpoints

- `app/api/ai/symptom-check/route.ts`: OpenAI call with a strict system prompt and structured JSON output (likely conditions, urgency level, recommended speciality). Must never present a definitive diagnosis — always include a disclaimer to consult a licensed doctor. This is a hard product/legal requirement, not a style choice.
- `app/api/ai/doctor-match/route.ts`: takes recommended speciality + patient location/filters, queries Supabase, ranks by speciality match, rating, experience, fee, and availability.
- `lib/openai.ts` holds the single configured OpenAI client; don't instantiate the client ad hoc elsewhere.

## Payments

Razorpay is primary (India-focused). `app/api/payments/create-order/route.ts` creates the order server-side; `app/api/payments/webhook/route.ts` handles async confirmation — never trust a client-side "payment succeeded" callback alone to mark an order/appointment as paid.

## What Not to Do

- Don't commit real values in `.env.local` or `.env.example`.
- Don't add a table/route without a corresponding RLS policy.
- Don't call the OpenAI or Razorpay APIs from client components.
- Don't hardcode the shadcn theme install command — the exact CLI command should be pulled live from the "Open in CLI" button on the 21st.dev theme page, since it changes.
- Don't mark a phase complete if `npm run build` has TypeScript errors.