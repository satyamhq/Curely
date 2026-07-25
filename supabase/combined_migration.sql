-- ====================================================================
-- CURELY COMPLETE DATABASE MIGRATION SCRIPT
-- Paste this entire script into your Supabase Dashboard -> SQL Editor and click RUN
-- ====================================================================

-- 1. CREATE ENUMS IF NOT EXIST
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('patient', 'doctor', 'pharmacy', 'lab', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_mode') THEN
        CREATE TYPE public.appointment_mode AS ENUM ('online', 'in_person');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lab_booking_status') THEN
        CREATE TYPE public.lab_booking_status AS ENUM ('pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
    END IF;
END $$;

-- 2. CREATE CORE TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'patient',
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    city TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    speciality TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    bio TEXT,
    qualifications TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pharmacies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    license_no TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    requires_prescription BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    license_no TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    description TEXT,
    sample_type TEXT NOT NULL DEFAULT 'Blood',
    turnaround_hours INT NOT NULL DEFAULT 24,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    slot_time TIMESTAMPTZ NOT NULL,
    status public.appointment_status NOT NULL DEFAULT 'pending',
    mode public.appointment_mode NOT NULL DEFAULT 'online',
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
    notes TEXT,
    prescription TEXT,
    chat_log JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    status public.order_status NOT NULL DEFAULT 'pending',
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    prescription_url TEXT,
    payment_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    qty INT NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS public.lab_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.lab_tests(id) ON DELETE CASCADE,
    slot_time TIMESTAMPTZ NOT NULL,
    status public.lab_booking_status NOT NULL DEFAULT 'pending',
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lab_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_booking_id UUID NOT NULL UNIQUE REFERENCES public.lab_bookings(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('doctor', 'pharmacy', 'lab')),
    target_id UUID NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    type TEXT NOT NULL DEFAULT 'info',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    related_type TEXT NOT NULL CHECK (related_type IN ('appointment', 'order', 'lab_booking')),
    related_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status public.payment_status NOT NULL DEFAULT 'pending',
    provider_ref TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INDEXES FOR HIGH-PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_doctors_speciality ON public.doctors(speciality);
CREATE INDEX IF NOT EXISTS idx_doctors_verified ON public.doctors(verified);
CREATE INDEX IF NOT EXISTS idx_medicines_pharmacy ON public.medicines(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_lab ON public.lab_tests(lab_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_orders_patient ON public.orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_orders_pharmacy ON public.orders(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_lab_bookings_patient ON public.lab_bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_bookings_lab ON public.lab_bookings(lab_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target ON public.reviews(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);

-- 4. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 5. ADMIN CHECK FUNCTION & RLS POLICIES
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop policies if they exist before creating
DROP POLICY IF EXISTS "Public profiles are readable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Doctor profiles are publicly readable" ON public.doctors;
DROP POLICY IF EXISTS "Doctors can manage their own profile" ON public.doctors;

DROP POLICY IF EXISTS "Doctor availability is publicly readable" ON public.doctor_availability;
DROP POLICY IF EXISTS "Doctors can manage their availability" ON public.doctor_availability;

DROP POLICY IF EXISTS "Pharmacies are publicly readable" ON public.pharmacies;
DROP POLICY IF EXISTS "Pharmacies can manage their own profile" ON public.pharmacies;
DROP POLICY IF EXISTS "Medicines catalog is publicly readable" ON public.medicines;
DROP POLICY IF EXISTS "Pharmacies can manage their medicines" ON public.medicines;

DROP POLICY IF EXISTS "Labs are publicly readable" ON public.labs;
DROP POLICY IF EXISTS "Labs can manage their own profile" ON public.labs;
DROP POLICY IF EXISTS "Lab tests catalog is publicly readable" ON public.lab_tests;
DROP POLICY IF EXISTS "Labs can manage their tests" ON public.lab_tests;

DROP POLICY IF EXISTS "Patients and assigned Doctors can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients and assigned Doctors can update appointments" ON public.appointments;

DROP POLICY IF EXISTS "Patients and assigned Doctors can view consultations" ON public.consultations;
DROP POLICY IF EXISTS "Doctors can manage consultations" ON public.consultations;

DROP POLICY IF EXISTS "Patients and Pharmacies can view orders" ON public.orders;
DROP POLICY IF EXISTS "Patients can create orders" ON public.orders;
DROP POLICY IF EXISTS "Patients and Pharmacies can update orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view order items for accessible orders" ON public.order_items;
DROP POLICY IF EXISTS "Patients can create order items" ON public.order_items;

DROP POLICY IF EXISTS "Patients and Labs can view lab bookings" ON public.lab_bookings;
DROP POLICY IF EXISTS "Patients can create lab bookings" ON public.lab_bookings;
DROP POLICY IF EXISTS "Patients and Labs can update lab bookings" ON public.lab_bookings;
DROP POLICY IF EXISTS "Patients and Labs can view lab reports" ON public.lab_reports;
DROP POLICY IF EXISTS "Labs can manage lab reports" ON public.lab_reports;

DROP POLICY IF EXISTS "Patients can view their own health records" ON public.health_records;
DROP POLICY IF EXISTS "Patients and uploader Doctors can insert health records" ON public.health_records;
DROP POLICY IF EXISTS "Patients can delete their own health records" ON public.health_records;

DROP POLICY IF EXISTS "Reviews are publicly readable" ON public.reviews;
DROP POLICY IF EXISTS "Patients can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Reviewers can update/delete their reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update read status on their notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can view their payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payment records" ON public.payments;

-- Create Policies
CREATE POLICY "Public profiles are readable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "Doctor profiles are publicly readable" ON public.doctors FOR SELECT TO authenticated, anon USING (TRUE);
CREATE POLICY "Doctors can manage their own profile" ON public.doctors FOR ALL TO authenticated USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "Doctor availability is publicly readable" ON public.doctor_availability FOR SELECT TO authenticated, anon USING (TRUE);
CREATE POLICY "Doctors can manage their availability" ON public.doctor_availability FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.profile_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Pharmacies are publicly readable" ON public.pharmacies FOR SELECT TO authenticated, anon USING (TRUE);
CREATE POLICY "Pharmacies can manage their own profile" ON public.pharmacies FOR ALL TO authenticated USING (profile_id = auth.uid() OR public.is_admin());
CREATE POLICY "Medicines catalog is publicly readable" ON public.medicines FOR SELECT TO authenticated, anon USING (TRUE);
CREATE POLICY "Pharmacies can manage their medicines" ON public.medicines FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.pharmacies p WHERE p.id = pharmacy_id AND p.profile_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Labs are publicly readable" ON public.labs FOR SELECT TO authenticated, anon USING (TRUE);
CREATE POLICY "Labs can manage their own profile" ON public.labs FOR ALL TO authenticated USING (profile_id = auth.uid() OR public.is_admin());
CREATE POLICY "Lab tests catalog is publicly readable" ON public.lab_tests FOR SELECT TO authenticated, anon USING (TRUE);
CREATE POLICY "Labs can manage their tests" ON public.lab_tests FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.labs l WHERE l.id = lab_id AND l.profile_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Patients and assigned Doctors can view appointments" ON public.appointments FOR SELECT TO authenticated USING (patient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.profile_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Patients can create appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (patient_id = auth.uid());
CREATE POLICY "Patients and assigned Doctors can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (patient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.profile_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Patients and assigned Doctors can view consultations" ON public.consultations FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.appointments a LEFT JOIN public.doctors d ON d.id = a.doctor_id WHERE a.id = appointment_id AND (a.patient_id = auth.uid() OR d.profile_id = auth.uid())) OR public.is_admin());
CREATE POLICY "Doctors can manage consultations" ON public.consultations FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.appointments a JOIN public.doctors d ON d.id = a.doctor_id WHERE a.id = appointment_id AND d.profile_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Patients and Pharmacies can view orders" ON public.orders FOR SELECT TO authenticated USING (patient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.pharmacies p WHERE p.id = pharmacy_id AND p.profile_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Patients can create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (patient_id = auth.uid());
CREATE POLICY "Patients and Pharmacies can update orders" ON public.orders FOR UPDATE TO authenticated USING (patient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.pharmacies p WHERE p.id = pharmacy_id AND p.profile_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Users can view order items for accessible orders" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o LEFT JOIN public.pharmacies p ON p.id = o.pharmacy_id WHERE o.id = order_id AND (o.patient_id = auth.uid() OR p.profile_id = auth.uid())) OR public.is_admin());
CREATE POLICY "Patients can create order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.patient_id = auth.uid()));

CREATE POLICY "Patients and Labs can view lab bookings" ON public.lab_bookings FOR SELECT TO authenticated USING (patient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.labs l WHERE l.id = lab_id AND l.profile_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Patients can create lab bookings" ON public.lab_bookings FOR INSERT TO authenticated WITH CHECK (patient_id = auth.uid());
CREATE POLICY "Patients and Labs can update lab bookings" ON public.lab_bookings FOR UPDATE TO authenticated USING (patient_id = auth.uid() OR EXISTS (SELECT 1 FROM public.labs l WHERE l.id = lab_id AND l.profile_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Patients and Labs can view lab reports" ON public.lab_reports FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.lab_bookings b LEFT JOIN public.labs l ON l.id = b.lab_id WHERE b.id = lab_booking_id AND (b.patient_id = auth.uid() OR l.profile_id = auth.uid())) OR public.is_admin());
CREATE POLICY "Labs can manage lab reports" ON public.lab_reports FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.lab_bookings b JOIN public.labs l ON l.id = b.lab_id WHERE b.id = lab_booking_id AND l.profile_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Patients can view their own health records" ON public.health_records FOR SELECT TO authenticated USING (patient_id = auth.uid() OR public.is_admin());
CREATE POLICY "Patients and uploader Doctors can insert health records" ON public.health_records FOR INSERT TO authenticated WITH CHECK (patient_id = auth.uid() OR uploaded_by = auth.uid() OR public.is_admin());
CREATE POLICY "Patients can delete their own health records" ON public.health_records FOR DELETE TO authenticated USING (patient_id = auth.uid() OR public.is_admin());

CREATE POLICY "Reviews are publicly readable" ON public.reviews FOR SELECT TO authenticated, anon USING (TRUE);
CREATE POLICY "Patients can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (reviewer_id = auth.uid());
CREATE POLICY "Reviewers can update/delete their reviews" ON public.reviews FOR UPDATE TO authenticated USING (reviewer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can update read status on their notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can view their payments" ON public.payments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can create payment records" ON public.payments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 6. AUTOMATIC AUTH USER PROFILE POPULATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role public.user_role := 'patient';
BEGIN
    IF (NEW.raw_user_meta_data->>'role') IS NOT NULL THEN
        user_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
    END IF;

    INSERT INTO public.profiles (id, role, full_name, avatar_url, phone, city)
    VALUES (
        NEW.id,
        user_role,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'city'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. UPDATED_AT TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS set_doctors_updated_at ON public.doctors;
DROP TRIGGER IF EXISTS set_pharmacies_updated_at ON public.pharmacies;
DROP TRIGGER IF EXISTS set_medicines_updated_at ON public.medicines;
DROP TRIGGER IF EXISTS set_labs_updated_at ON public.labs;
DROP TRIGGER IF EXISTS set_lab_tests_updated_at ON public.lab_tests;
DROP TRIGGER IF EXISTS set_appointments_updated_at ON public.appointments;
DROP TRIGGER IF EXISTS set_consultations_updated_at ON public.consultations;
DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS set_lab_bookings_updated_at ON public.lab_bookings;
DROP TRIGGER IF EXISTS set_payments_updated_at ON public.payments;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_pharmacies_updated_at BEFORE UPDATE ON public.pharmacies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_medicines_updated_at BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_labs_updated_at BEFORE UPDATE ON public.labs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_lab_tests_updated_at BEFORE UPDATE ON public.lab_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_lab_bookings_updated_at BEFORE UPDATE ON public.lab_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('prescriptions', 'prescriptions', false),
    ('lab_reports', 'lab_reports', false),
    ('health_records', 'health_records', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their own prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Users and labs can view lab reports" ON storage.objects;
DROP POLICY IF EXISTS "Labs can upload lab reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can access their own health records" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload health records" ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Users can access their own prescriptions" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'prescriptions' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));
CREATE POLICY "Users can upload prescriptions" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users and labs can view lab reports" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'lab_reports');
CREATE POLICY "Labs can upload lab reports" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'lab_reports');
CREATE POLICY "Users can access their own health records" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'health_records' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));
CREATE POLICY "Users can upload health records" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'health_records' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 9. BASELINE CATALOG SEED DATA

-- Baseline Doctor Profiles
INSERT INTO public.profiles (id, role, full_name, avatar_url, phone, city)
VALUES
  ('11111111-1111-4111-a111-111111111111', 'doctor', 'Dr. Rajesh Sharma', NULL, '+919876543210', 'Mumbai'),
  ('22222222-2222-4222-a222-222222222222', 'doctor', 'Dr. Priya Ananth', NULL, '+919876543211', 'Bengaluru'),
  ('33333333-3333-4333-a333-333333333333', 'doctor', 'Dr. Vikram Sethi', NULL, '+919876543212', 'Delhi NCR')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  city = EXCLUDED.city;

-- Doctors Table Records
INSERT INTO public.doctors (id, profile_id, speciality, experience_years, fee, bio, qualifications, verified)
VALUES
  ('d1111111-1111-4111-a111-111111111111', '11111111-1111-4111-a111-111111111111', 'General Physician', 12, 500, 'Senior General Physician specializing in preventive health care, fever management, and lifestyle disorders.', 'MBBS, MD (Internal Medicine)', true),
  ('d2222222-2222-4222-a222-222222222222', '22222222-2222-4222-a222-222222222222', 'Cardiologist', 18, 1200, 'Consultant Interventional Cardiologist with extensive expertise in heart health and blood pressure control.', 'MBBS, DM (Cardiology)', true),
  ('d3333333-3333-4333-a333-333333333333', '33333333-3333-4333-a333-333333333333', 'Dermatologist', 9, 750, 'Specialist in clinical dermatology, skin rejuvenation, acne treatment, and hair care therapies.', 'MBBS, DVD, MD (Dermatology)', true)
ON CONFLICT (id) DO UPDATE SET
  speciality = EXCLUDED.speciality,
  experience_years = EXCLUDED.experience_years,
  fee = EXCLUDED.fee,
  verified = EXCLUDED.verified;

-- Doctor Availability Records
INSERT INTO public.doctor_availability (id, doctor_id, day_of_week, start_time, end_time)
VALUES
  ('a1111111-1111-4111-a111-111111111111', 'd1111111-1111-4111-a111-111111111111', 1, '09:00', '17:00'),
  ('a2222222-2222-4222-a222-222222222222', 'd2222222-2222-4222-a222-222222222222', 2, '10:00', '18:00'),
  ('a3333333-3333-4333-a333-333333333333', 'd3333333-3333-4333-a333-333333333333', 3, '11:00', '19:00')
ON CONFLICT (id) DO NOTHING;

-- Baseline Pharmacy Profiles
INSERT INTO public.profiles (id, role, full_name, avatar_url, phone, city)
VALUES
  ('44444444-4444-4444-a444-444444444444', 'pharmacy', 'Apollo Pharmacy Main Branch', NULL, '+919876543213', 'Mumbai'),
  ('55555555-5555-4555-a555-555555555555', 'pharmacy', 'MedPlus Wellness Express', NULL, '+919876543214', 'Bengaluru')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  city = EXCLUDED.city;

INSERT INTO public.pharmacies (id, profile_id, name, address, license_no, verified)
VALUES
  ('p4444444-4444-4444-a444-444444444444', '44444444-4444-4444-a444-444444444444', 'Apollo Pharmacy Main Branch', '45 MG Road, Fort, Mumbai', 'LIC-MH-2024-8891', true),
  ('p5555555-5555-4555-a555-555555555555', '55555555-5555-4555-a555-555555555555', 'MedPlus Wellness Express', '12 100ft Road, Indiranagar, Bengaluru', 'LIC-KA-2024-3321', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  verified = EXCLUDED.verified;

-- Baseline Medicines Catalog
INSERT INTO public.medicines (id, pharmacy_id, name, price, stock, requires_prescription, description, image_url)
VALUES
  ('m1111111-1111-4111-a111-111111111111', 'p4444444-4444-4444-a444-444444444444', 'Paracetamol 650mg (Dolo)', 32, 200, false, 'Fast acting fever and pain reliever tablets.', NULL),
  ('m2222222-2222-4222-a222-222222222222', 'p4444444-4444-4444-a444-444444444444', 'Amoxicillin 500mg Antibiotic', 110, 85, true, 'Prescription antibiotic capsule for bacterial infections.', NULL),
  ('m3333333-3333-4333-a333-333333333333', 'p5555555-5555-4555-a555-555555555555', 'Cetirizine 10mg Allergy Relief', 45, 150, false, 'Non-drowsy antihistamine for allergy symptoms.', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock;

-- Baseline Lab Profiles
INSERT INTO public.profiles (id, role, full_name, avatar_url, phone, city)
VALUES
  ('66666666-6666-4666-a666-666666666666', 'lab', 'Dr. Lal PathLabs Central', NULL, '+919876543215', 'Delhi NCR'),
  ('77777777-7777-4777-a777-777777777777', 'lab', 'Metropolis Healthcare Lab', NULL, '+919876543216', 'Mumbai')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  city = EXCLUDED.city;

INSERT INTO public.labs (id, profile_id, name, address, license_no, verified)
VALUES
  ('l6666666-6666-4666-a666-666666666666', '66666666-6666-4666-a666-666666666666', 'Dr. Lal PathLabs Central', '18 Barakhamba Road, Connaught Place, New Delhi', 'LAB-DL-2024-9912', true),
  ('l7777777-7777-4777-a777-777777777777', '77777777-7777-4777-a777-777777777777', 'Metropolis Healthcare Lab', '88 Bandra Kurla Complex, Mumbai', 'LAB-MH-2024-4410', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  verified = EXCLUDED.verified;

-- Baseline Lab Tests Catalog
INSERT INTO public.lab_tests (id, lab_id, name, price, description, sample_type, turnaround_hours)
VALUES
  ('t1111111-1111-4111-a111-111111111111', 'l6666666-6666-4666-a666-666666666666', 'Complete Blood Count (CBC)', 350, 'Comprehensive analysis of RBC, WBC, platelets, and hemoglobin levels.', 'Blood', 24),
  ('t2222222-2222-4222-a222-222222222222', 'l6666666-6666-4666-a666-666666666666', 'Thyroid Profile Total (T3, T4, TSH)', 650, 'Evaluates thyroid gland performance and metabolic rate balance.', 'Blood', 24),
  ('t3333333-3333-4333-a333-333333333333', 'l7777777-7777-4777-a777-777777777777', 'HbA1c Diabetes Screening', 490, 'Measures average blood sugar levels over the past 3 months.', 'Blood', 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price;

-- Baseline Patient Profile & Reviews
INSERT INTO public.profiles (id, role, full_name, avatar_url, phone, city)
VALUES
  ('88888888-8888-4888-a888-888888888888', 'patient', 'Amit Patel', NULL, '+919876543217', 'Mumbai'),
  ('99999999-9999-4999-a999-999999999999', 'patient', 'Sunita Rao', NULL, '+919876543218', 'Bengaluru')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name;

INSERT INTO public.reviews (id, reviewer_id, target_type, target_id, rating, comment, created_at)
VALUES
  ('r1111111-1111-4111-a111-111111111111', '88888888-8888-4888-a888-888888888888', 'doctor', 'd1111111-1111-4111-a111-111111111111', 5, 'Dr. Rajesh was extremely thorough and attentive to my symptoms.', NOW() - INTERVAL '3 days'),
  ('r2222222-2222-4222-a222-222222222222', '99999999-9999-4999-a999-999999999999', 'doctor', 'd1111111-1111-4111-a111-111111111111', 5, 'Very quick diagnosis and great consultation manner.', NOW() - INTERVAL '1 day'),
  ('r3333333-3333-4333-a333-333333333333', '88888888-8888-4888-a888-888888888888', 'doctor', 'd2222222-2222-4222-a222-222222222222', 4, 'Very knowledgeable cardiologist. Prescribed clear lifestyle adjustments.', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

