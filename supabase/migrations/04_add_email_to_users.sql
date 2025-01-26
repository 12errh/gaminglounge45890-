-- Add email column to users table
ALTER TABLE public.users ADD COLUMN email TEXT UNIQUE;

-- Update the existing policies to include email
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT
    USING (auth_key = current_setting('request.jwt.claims', true)::json->>'auth_key' OR email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE
    USING (auth_key = current_setting('request.jwt.claims', true)::json->>'auth_key' OR email = current_setting('request.jwt.claims', true)::json->>'email');

-- Update the login function to include email in the returned data
CREATE OR REPLACE FUNCTION public.login(p_auth_key TEXT)
RETURNS json AS $$
DECLARE
    user_data json;
BEGIN
    UPDATE public.users
    SET last_login = now()
    WHERE auth_key = p_auth_key
    RETURNING json_build_object(
        'id', id,
        'nickname', nickname,
        'email', email,
        'favorite_game', favorite_game,
        'gaming_experience', gaming_experience,
        'auth_key', auth_key
    ) INTO user_data;

    IF user_data IS NULL THEN
        RETURN json_build_object('error', 'Invalid auth key');
    ELSE
        RETURN user_data;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

