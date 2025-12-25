-- Add UPDATE policy for greetings table - only admins can update
CREATE POLICY "Admins can update greetings"
ON public.greetings
AS RESTRICTIVE
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));