-- Create admin_actions table for audit logging
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON public.admin_actions(target_entity, target_id);

DROP POLICY IF EXISTS "Admins can manage admin actions" ON public.admin_actions;
CREATE POLICY "Admins can manage admin actions" ON public.admin_actions FOR ALL TO authenticated USING (public.is_admin());
