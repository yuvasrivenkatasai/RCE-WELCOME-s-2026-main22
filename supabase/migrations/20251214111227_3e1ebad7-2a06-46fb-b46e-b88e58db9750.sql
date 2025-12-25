-- Add restrictive INSERT policy - only admins can assign roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add restrictive UPDATE policy - only admins can modify roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add restrictive DELETE policy - only admins can remove roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));