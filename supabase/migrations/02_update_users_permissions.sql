-- Drop the existing RLS policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Allow insertion of new users" ON public.users;

-- Create a new policy to allow insertion of new users without authentication
CREATE POLICY "Allow insertion of new users" ON public.users
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy to allow users to read their own data (using auth_key instead of auth.uid())
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT
    USING (auth_key = current_setting('request.auth_key', true));

-- Policy to allow users to update their own data (using auth_key instead of auth.uid())
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE
    USING (auth_key = current_setting('request.auth_key', true));

-- Grant necessary permissions
GRANT ALL ON TABLE public.users TO authenticated, anon;

