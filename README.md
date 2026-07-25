# 🏥 Curely — Next-Gen AI Healthcare Marketplace & Telemedicine Platform

> **"Zomato for Healthcare + AI Health Assistant"** — Connecting patients with doctors, pharmacies, and diagnostic labs, backed by OpenAI-powered symptom analysis, real-time consultation scheduling, and comprehensive admin governance.

---

## 🌟 Key Platform Features

Curely is structured into **5 distinct role-based modules**:

### 1. 🤖 Patient Module & AI Health Assistant
- **AI Symptom Checker**: Integrated with OpenAI GPT-4 to triage symptoms, determine urgency levels, recommend medical specialities, and generate structured non-diagnostic guidance with legal medical disclaimers.
- **AI Doctor Matching**: Ranks doctors dynamically based on symptom severity, speciality match, patient location, fees, and rating averages.
- **Doctor Discovery & Booking**: Filter by speciality, city, fee, rating, and experience. Interactive booking calendar synced to real provider availability slots.
- **Pharmacy Marketplace**: Search medicine catalogs, filter Rx-required vs OTC drugs, manage cart state with Zustand, and complete online checkout.
- **Diagnostic Labs**: Browse lab test catalogs (blood panels, imaging), sample collection types, turnaround times, and book lab appointments.
- **Personal Health Records**: Securely upload, organize, and view health records (prescriptions, lab reports) backed by Supabase Storage RLS policies.

### 2. 👨‍⚕️ Doctor Portal (`/doctor-dashboard`)
- **Real Availability Schedule**: Configure weekly consultation hours in `doctor_availability` table with automatic slot collision avoidance against booked appointments.
- **Consultation Management**: View upcoming patient consultations, write medical notes, and issue digital prescriptions.
- **Real Earnings & Analytics**: Track practice revenue summed from actual completed consultations (`SUM(amount)` where `status = 'completed'`).

### 3. 💊 Pharmacy Portal (`/pharmacy-dashboard`)
- **Inventory Management**: Create, update, and manage medicine stock, pricing, and prescription requirements.
- **Order Fulfillment**: Track incoming patient prescription orders, update delivery statuses (`processing`, `shipped`, `delivered`), and verify attached prescription files.

### 4. 🔬 Diagnostic Lab Portal (`/lab-dashboard`)
- **Test Catalog**: Manage offered diagnostic tests, prices, sample types, and turnaround hours.
- **Booking & Report Upload**: Manage patient lab bookings, collect samples, and upload PDF lab reports directly accessible by patients.

### 5. 🛡️ Admin Governance & Entity CRUD (`/admin`)
- **Designated Admin Account**: Automatically granted to `satyam31sk@gmail.com` upon signup.
- **Provider Approval Queue (`/admin/verifications`)**: Review license documentation submitted by newly registered doctors, pharmacies, and labs. Approve or reject listings.
- **User Directory (`/admin/users`)**: Search, filter, and manage all registered patient and provider accounts.
- **Full Entity Data CRUD (`/admin/data`)**: Full Create, Read, Update, and Delete capabilities across Doctors, Pharmacies, Medicines, Labs, Tests, Appointments, Orders, and Reviews.
- **Real-Time Audit Trail**: Every admin approval, modification, or deletion is recorded with timestamps in `public.admin_actions`.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 App Router, TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS, Modern Minimal Theme, Lucide React Icons |
| **Database & Auth** | Supabase Postgres, Supabase Auth, Row Level Security (RLS), Supabase Storage Buckets |
| **AI Integration** | OpenAI API (Symptom Checker & Doctor Matching) |
| **Payments** | Razorpay / Express Test Checkout |
| **State & Validation** | Zustand (Cart & UI State), react-hook-form + Zod |
| **Build & Deploy** | Vercel Ready, Zero TypeScript Build Errors |

---

## 🗄️ Database Setup & Single Migration Script

All database tables, enums, performance indexes, RLS policies, trigger functions, storage bucket rules, and admin role assignments are consolidated into **one single script**:

📄 **`supabase/combined_migration.sql`**

### Steps to Initialize Database:
1. Open your **Supabase Dashboard** → **SQL Editor**.
2. Copy and paste the entire contents of [`supabase/combined_migration.sql`](file:///d:/Curely/supabase/combined_migration.sql).
3. Click **RUN**.

---

## 🔑 Environment Variables (`.env.local`)

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 👑 Designated Admin Login

To log in as the Platform Administrator:

- **Login Page**: [http://localhost:3000/login](http://localhost:3000/login)
- **Admin Email**: `satyam31sk@gmail.com`
- **Admin Password**: `Satyam@2008`

*(If registering for the first time on a fresh database, sign up at `/signup` using `satyam31sk@gmail.com` — the Postgres trigger will automatically assign the `admin` role and redirect you to `/admin`.)*

---

## 📄 License

Developed for Curely Healthcare Platform. All rights reserved.
