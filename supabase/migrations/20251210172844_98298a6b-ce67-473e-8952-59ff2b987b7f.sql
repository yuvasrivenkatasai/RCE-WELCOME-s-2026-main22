-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create greetings table to store generated greetings
CREATE TABLE public.greetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  branch TEXT NOT NULL,
  year TEXT NOT NULL,
  enrollment_number TEXT,
  goal TEXT,
  greeting_title TEXT NOT NULL,
  greeting_body TEXT NOT NULL,
  motivational_quote TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'EN',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on greetings
ALTER TABLE public.greetings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert greetings (public feature)
CREATE POLICY "Anyone can insert greetings"
ON public.greetings
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins can view all greetings
CREATE POLICY "Admins can view all greetings"
ON public.greetings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can delete greetings
CREATE POLICY "Admins can delete greetings"
ON public.greetings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy for user_roles: Only admins can view roles
CREATE POLICY "Admins can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- Enable realtime for greetings
ALTER PUBLICATION supabase_realtime ADD TABLE public.greetings;