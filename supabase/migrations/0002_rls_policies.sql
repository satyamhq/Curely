-- 0002_rls_policies.sql: Enable RLS and define security policies for all tables

-- Enable RLS on every table
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

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles
CREATE POLICY "Public profiles are readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

-- 2. Doctors
CREATE POLICY "Doctor profiles are publicly readable"
    ON public.doctors FOR SELECT
    TO authenticated, anon
    USING (TRUE);

CREATE POLICY "Doctors can manage their own profile"
    ON public.doctors FOR ALL
    TO authenticated
    USING (profile_id = auth.uid() OR public.is_admin());

-- 3. Doctor Availability
CREATE POLICY "Doctor availability is publicly readable"
    ON public.doctor_availability FOR SELECT
    TO authenticated, anon
    USING (TRUE);

CREATE POLICY "Doctors can manage their availability"
    ON public.doctor_availability FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.doctors d
            WHERE d.id = doctor_id AND d.profile_id = auth.uid()
        ) OR public.is_admin()
    );

-- 4. Pharmacies
CREATE POLICY "Pharmacies are publicly readable"
    ON public.pharmacies FOR SELECT
    TO authenticated, anon
    USING (TRUE);

CREATE POLICY "Pharmacies can manage their own profile"
    ON public.pharmacies FOR ALL
    TO authenticated
    USING (profile_id = auth.uid() OR public.is_admin());

-- 5. Medicines
CREATE POLICY "Medicines catalog is publicly readable"
    ON public.medicines FOR SELECT
    TO authenticated, anon
    USING (TRUE);

CREATE POLICY "Pharmacies can manage their medicines"
    ON public.medicines FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.pharmacies p
            WHERE p.id = pharmacy_id AND p.profile_id = auth.uid()
        ) OR public.is_admin()
    );

-- 6. Labs
CREATE POLICY "Labs are publicly readable"
    ON public.labs FOR SELECT
    TO authenticated, anon
    USING (TRUE);

CREATE POLICY "Labs can manage their own profile"
    ON public.labs FOR ALL
    TO authenticated
    USING (profile_id = auth.uid() OR public.is_admin());

-- 7. Lab Tests
CREATE POLICY "Lab tests catalog is publicly readable"
    ON public.lab_tests FOR SELECT
    TO authenticated, anon
    USING (TRUE);

CREATE POLICY "Labs can manage their tests"
    ON public.lab_tests FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.labs l
            WHERE l.id = lab_id AND l.profile_id = auth.uid()
        ) OR public.is_admin()
    );

-- 8. Appointments
CREATE POLICY "Patients can view their appointments"
    ON public.appointments FOR SELECT
    TO authenticated
    USING (
        patient_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.doctors d
            WHERE d.id = doctor_id AND d.profile_id = auth.uid()
        ) OR public.is_admin()
    );

CREATE POLICY "Patients can create appointments"
    ON public.appointments FOR INSERT
    TO authenticated
    WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients and assigned Doctors can update appointments"
    ON public.appointments FOR UPDATE
    TO authenticated
    USING (
        patient_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.doctors d
            WHERE d.id = doctor_id AND d.profile_id = auth.uid()
        ) OR public.is_admin()
    );

-- 9. Consultations
CREATE POLICY "Patients and assigned Doctors can view consultations"
    ON public.consultations FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.appointments a
            LEFT JOIN public.doctors d ON d.id = a.doctor_id
            WHERE a.id = appointment_id AND (a.patient_id = auth.uid() OR d.profile_id = auth.uid())
        ) OR public.is_admin()
    );

CREATE POLICY "Doctors can manage consultations"
    ON public.consultations FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.appointments a
            JOIN public.doctors d ON d.id = a.doctor_id
            WHERE a.id = appointment_id AND d.profile_id = auth.uid()
        ) OR public.is_admin()
    );

-- 10. Orders
CREATE POLICY "Patients and Pharmacies can view orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (
        patient_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.pharmacies p
            WHERE p.id = pharmacy_id AND p.profile_id = auth.uid()
        ) OR public.is_admin()
    );

CREATE POLICY "Patients can create orders"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients and Pharmacies can update orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (
        patient_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.pharmacies p
            WHERE p.id = pharmacy_id AND p.profile_id = auth.uid()
        ) OR public.is_admin()
    );

-- 11. Order Items
CREATE POLICY "Users can view order items for accessible orders"
    ON public.order_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            LEFT JOIN public.pharmacies p ON p.id = o.pharmacy_id
            WHERE o.id = order_id AND (o.patient_id = auth.uid() OR p.profile_id = auth.uid())
        ) OR public.is_admin()
    );

CREATE POLICY "Patients can create order items"
    ON public.order_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_id AND o.patient_id = auth.uid()
        )
    );

-- 12. Lab Bookings
CREATE POLICY "Patients and Labs can view lab bookings"
    ON public.lab_bookings FOR SELECT
    TO authenticated
    USING (
        patient_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.labs l
            WHERE l.id = lab_id AND l.profile_id = auth.uid()
        ) OR public.is_admin()
    );

CREATE POLICY "Patients can create lab bookings"
    ON public.lab_bookings FOR INSERT
    TO authenticated
    WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients and Labs can update lab bookings"
    ON public.lab_bookings FOR UPDATE
    TO authenticated
    USING (
        patient_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.labs l
            WHERE l.id = lab_id AND l.profile_id = auth.uid()
        ) OR public.is_admin()
    );

-- 13. Lab Reports
CREATE POLICY "Patients and Labs can view lab reports"
    ON public.lab_reports FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.lab_bookings b
            LEFT JOIN public.labs l ON l.id = b.lab_id
            WHERE b.id = lab_booking_id AND (b.patient_id = auth.uid() OR l.profile_id = auth.uid())
        ) OR public.is_admin()
    );

CREATE POLICY "Labs can manage lab reports"
    ON public.lab_reports FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.lab_bookings b
            JOIN public.labs l ON l.id = b.lab_id
            WHERE b.id = lab_booking_id AND l.profile_id = auth.uid()
        ) OR public.is_admin()
    );

-- 14. Health Records
CREATE POLICY "Patients can view their own health records"
    ON public.health_records FOR SELECT
    TO authenticated
    USING (patient_id = auth.uid() OR public.is_admin());

CREATE POLICY "Patients and uploader Doctors can insert health records"
    ON public.health_records FOR INSERT
    TO authenticated
    WITH CHECK (patient_id = auth.uid() OR uploaded_by = auth.uid() OR public.is_admin());

CREATE POLICY "Patients can delete their own health records"
    ON public.health_records FOR DELETE
    TO authenticated
    USING (patient_id = auth.uid() OR public.is_admin());

-- 15. Reviews
CREATE POLICY "Reviews are publicly readable"
    ON public.reviews FOR SELECT
    TO authenticated, anon
    USING (TRUE);

CREATE POLICY "Patients can create reviews"
    ON public.reviews FOR INSERT
    TO authenticated
    WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Reviewers can update/delete their reviews"
    ON public.reviews FOR UPDATE
    TO authenticated
    USING (reviewer_id = auth.uid() OR public.is_admin());

-- 16. Notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update read status on their notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- 17. Payments
CREATE POLICY "Users can view their payments"
    ON public.payments FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create payment records"
    ON public.payments FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
