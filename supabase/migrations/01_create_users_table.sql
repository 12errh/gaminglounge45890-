-- Create the users table
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nickname TEXT NOT NULL UNIQUE,
    auth_key TEXT NOT NULL UNIQUE,
    favorite_game TEXT,
    gaming_experience TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ
);

-- Create indexes for faster queries
CREATE INDEX idx_users_nickname ON public.users (nickname);
CREATE INDEX idx_users_auth_key ON public.users (auth_key);

-- Function to generate a unique auth key
CREATE OR REPLACE FUNCTION generate_unique_auth_key() 
RETURNS TEXT AS $$
DECLARE
    key TEXT;
    key_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random string
        key := substr(md5(random()::text), 0, 20);
        
        -- Check if this key already exists
        SELECT EXISTS(SELECT 1 FROM public.users WHERE auth_key = key) INTO key_exists;
        
        -- If the key doesn't exist, we can use it
        IF NOT key_exists THEN
            RETURN key;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate auth_key before insert
CREATE OR REPLACE FUNCTION set_auth_key()
RETURNS TRIGGER AS $$
BEGIN
    NEW.auth_key := generate_unique_auth_key();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_auth_key
BEFORE INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION set_auth_key();

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy to allow insertion of new users (for signup)
CREATE POLICY "Allow insertion of new users" ON public.users
    FOR INSERT
    WITH CHECK (true);

-- Function to handle user login
CREATE OR REPLACE FUNCTION public.handle_login(p_auth_key TEXT)
RETURNS TABLE (
    id UUID,
    nickname TEXT,
    favorite_game TEXT,
    gaming_experience TEXT
) AS $$
BEGIN
    RETURN QUERY
    UPDATE public.users
    SET last_login = now()
    WHERE auth_key = p_auth_key
    RETURNING id, nickname, favorite_game, gaming_experience;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON TABLE public.users TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.handle_login TO authenticated, anon;

