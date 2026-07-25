-- 0004_storage_buckets.sql: Supabase Storage configuration for Curely

-- Create Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('prescriptions', 'prescriptions', false),
    ('lab_reports', 'lab_reports', false),
    ('health_records', 'health_records', false)
ON CONFLICT (id) DO NOTHING;

-- 1. Avatars Storage Policies
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'avatars');

-- 2. Prescriptions Storage Policies
CREATE POLICY "Users can access their own prescriptions"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'prescriptions' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));

CREATE POLICY "Users can upload prescriptions"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Lab Reports Storage Policies
CREATE POLICY "Users and labs can view lab reports"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'lab_reports');

CREATE POLICY "Labs can upload lab reports"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'lab_reports');

-- 4. Health Records Storage Policies
CREATE POLICY "Users can access their own health records"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'health_records' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));

CREATE POLICY "Users can upload health records"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'health_records' AND auth.uid()::text = (storage.foldername(name))[1]);
