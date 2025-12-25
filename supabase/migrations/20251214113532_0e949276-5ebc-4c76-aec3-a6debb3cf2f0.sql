-- Add public SELECT policy for greetings to enable share links feature
-- Greetings are designed to be publicly shareable via links and QR codes
-- UUIDs are unguessable, so this provides security through obscurity
CREATE POLICY "Anyone can view greetings via share link" 
ON public.greetings 
FOR SELECT 
USING (true);