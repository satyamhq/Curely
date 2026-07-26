# Curely — Claude Code Build Prompt (10 Phases)

Paste this whole document into Claude Code as your working brief. Work through the phases in order — treat each phase as its own task, get it working and reviewed before moving to the next. Don't let Claude Code jump ahead to later phases.

---

## Project Context (give this to Claude Code up front)

> Build **Curely**, an AI-powered healthcare marketplace ("Zomato for Healthcare + AI Health Assistant"). Patients describe symptoms and get AI-recommended doctors (by speciality, experience, reviews, fees, location, availability), then book appointments, consult online, order medicines, book lab tests, and manage health records — all in one app. Doctors, pharmacies, and labs each get a dashboard to manage profiles, services, bookings, inventory, reports, and patients.
>
> **Stack:** Next.js (App Router, TypeScript), Supabase (Postgres + Auth + Storage) via `@supabase/ssr`, OpenAI API for the symptom-to-doctor recommendation engine, deployed on Vercel. UI theme: "modern-minimal" (21st.dev, @serafimcloud) as the visual base.
>
> Environment variables will be added by me in `.env.local` — scaffold `.env.local.example` with placeholders and read all secrets via `process.env`. Never hardcode keys in code.

---

### Phase 1 — Project Scaffolding & Environment
- Init Next.js (TypeScript, App Router, Tailwind).
- Install `@supabase/supabase-js`, `@supabase/ssr`, `openai`.
- Create `utils/supabase/client.ts`, `utils/supabase/server.ts`, `utils/supabase/middleware.ts` (SSR-safe session refresh) and root `middleware.ts`.
- Create `.env.local.example` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only) placeholders — no real values.
- Set up folder structure: `app/(patient)`, `app/(doctor)`, `app/(pharmacy)`, `app/(lab)`, `app/(auth)`, `components/`, `lib/`, `types/`.
- Pull in the modern-minimal theme (21st.dev) as the base design tokens/components layer.
- Deliverable: app boots locally, connects to Supabase, renders a themed placeholder home page.

### Phase 2 — Database Schema & Row-Level Security
- Design Postgres schema in Supabase: `profiles` (role: patient/doctor/pharmacy/lab/admin), `doctors`, `pharmacies`, `labs`, `appointments`, `consultations`, `prescriptions`, `medicines`, `orders`, `lab_tests`, `lab_bookings`, `reviews`, `health_records`.
- Write SQL migrations (as files, not just dashboard clicks) so the schema is reproducible.
- Enable RLS on every table; write policies so patients only see their own data, providers only see their own listings/bookings, and public read-only fields (doctor profiles, medicine catalog) are open.
- Deliverable: migration files in the repo + a schema diagram/README describing relationships.

### Phase 3 — Auth & Role-Based Access
- Supabase Auth: email/password + optional OAuth. Sign-up captures role (patient/doctor/pharmacy/lab).
- Post-signup, doctors/pharmacies/labs go through a profile/verification step before their listing goes live.
- Protected routes per role via middleware; redirect logic for unauthenticated/wrong-role access.
- Deliverable: working signup/login/logout, role-aware redirects, session persists via SSR cookies.

### Phase 4 — Design System & Shared UI
- Build the shared component library on top of the modern-minimal theme: nav bars (per role), cards, buttons, form inputs, modals, tables, empty/loading/error states.
- Mobile-responsive layout shell for patient app vs. dashboard layout shell for providers.
- Deliverable: Storybook-style component page or a `/design-system` route showing all shared components.

### Phase 5 — AI Symptom-to-Doctor Recommendation Engine
- Build an API route that takes free-text symptoms, calls OpenAI to extract likely specialities/urgency, then queries the `doctors` table filtering/ranking by speciality match, experience, reviews, fees, location, and availability.
- Design the prompt so the model returns structured JSON (speciality tags, urgency level, short rationale) — validate/parse defensively.
- Build the patient-facing symptom input UI and the resulting ranked doctor list with the "why recommended" explanation shown.
- Deliverable: end-to-end flow from symptom text → ranked, explainable doctor recommendations.

### Phase 6 — Doctor Discovery, Booking & Online Consultation
- Search/filter UI (speciality, experience, reviews, fee range, location, availability) independent of the AI flow, for direct browsing.
- Doctor profile page with availability calendar; booking flow with slot locking to prevent double-booking.
- Online consultation: start with a simple video/chat integration point (stub or third-party embed) plus a consultation notes record tied to the appointment.
- Deliverable: patient can find a doctor, book a slot, and enter a consultation session.

### Phase 7 — Doctor Dashboard
- Profile management (bio, speciality, fees, availability schedule).
- Bookings view (upcoming/past), accept/reschedule/cancel.
- Patient history view scoped to that doctor's own patients only.
- Consultation notes & prescription writing tied to `prescriptions` table.
- Deliverable: a doctor can fully manage their practice from this dashboard.

### Phase 8 — Pharmacy Module
- Pharmacy dashboard: manage medicine catalog (`medicines`), stock levels, pricing.
- Patient-facing: browse/search medicines, upload a prescription (from Phase 7 or manual upload), place an order.
- Order lifecycle (placed → confirmed → fulfilled) visible to both patient and pharmacy dashboard.
- Deliverable: patient can order medicines against a prescription; pharmacy can manage inventory and fulfill orders.

### Phase 9 — Lab Module & Health Records
- Lab dashboard: manage test catalog (`lab_tests`), pricing, appointment slots, report uploads (Supabase Storage).
- Patient-facing: browse/book lab tests, view/download reports once uploaded.
- Unified patient health records page pulling together consultations, prescriptions, orders, and lab reports chronologically.
- Deliverable: patient has one page showing their full healthcare history across all three provider types.

### Phase 10 — Polish, Security Review & Deployment
- Full RLS audit — attempt cross-role/cross-user access and confirm it's blocked.
- Error handling, loading states, empty states pass across every screen.
- Admin view (basic) for verifying new doctor/pharmacy/lab signups before they go live.
- Environment variable audit — confirm no secret leaks client-side (only `NEXT_PUBLIC_*` vars in the browser bundle).
- Deploy to Vercel, connect env vars in the Vercel dashboard, smoke-test the production build end-to-end.
- Deliverable: live Curely app on Vercel, all core patient/doctor/pharmacy/lab flows working.

---

**Working notes for Claude Code:**
- Treat each phase as a checkpoint — build, test, and confirm before moving on.
- Keep Supabase queries in typed helper functions (`lib/db/*.ts`) rather than scattering raw queries through components.
- Never commit `.env.local`; only `.env.local.example` goes in the repo.