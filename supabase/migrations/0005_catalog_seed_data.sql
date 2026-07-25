-- Seed baseline catalog profiles and reference entries for Doctors, Pharmacies, Medicines, Labs, and Lab Tests

-- 1. Baseline Doctor Profiles
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

-- 2. Baseline Pharmacy Profiles
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

-- 3. Baseline Lab Profiles
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

-- 4. Baseline Patient Profile & Reviews
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

