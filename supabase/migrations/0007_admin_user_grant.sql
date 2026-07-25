-- 0007_admin_user_grant.sql: Ensure satyam31sk@gmail.com has admin role
DO $$
BEGIN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id IN (
        SELECT id FROM auth.users WHERE LOWER(email) = 'satyam31sk@gmail.com'
    );
END $$;
