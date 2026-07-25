-- 0003_functions_triggers.sql: Database functions and triggers for Curely

-- Function to handle new user registration from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role public.user_role := 'patient';
BEGIN
    -- Grant admin role automatically to designated admin email
    IF LOWER(NEW.email) = 'satyam31sk@gmail.com' THEN
        user_role := 'admin';
    ELSIF (NEW.raw_user_meta_data->>'role') IS NOT NULL THEN
        user_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
    END IF;

    INSERT INTO public.profiles (id, role, full_name, avatar_url, phone, city)
    VALUES (
        NEW.id,
        user_role,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Satyam (Admin)'),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'city'
    )
    ON CONFLICT (id) DO UPDATE SET
        role = EXCLUDED.role;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically populate profile upon signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generic function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
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
