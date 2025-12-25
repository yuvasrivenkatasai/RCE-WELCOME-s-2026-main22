-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert greetings" ON public.greetings;

-- Create a restrictive policy that only allows inserts from authenticated users
-- (The edge function uses service role which bypasses RLS, so it will still work)
CREATE POLICY "Authenticated users can insert greetings"
ON public.greetings
FOR INSERT
TO authenticated
WITH CHECK (true);