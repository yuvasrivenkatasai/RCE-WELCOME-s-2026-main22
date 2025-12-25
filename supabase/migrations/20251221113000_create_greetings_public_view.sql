-- Remove permissive public SELECT policy on `public.greetings` and create a public view without `email`.
-- This prevents user-provided emails from being exposed via public selects.

-- Drop the old permissive SELECT policy if present
DROP POLICY IF EXISTS "Anyone can view greetings via share link" ON public.greetings;

-- Create a public view that excludes the `email` column
CREATE OR REPLACE VIEW public.greetings_public AS
SELECT
  id,
  name,
  branch,
  year,
  enrollment_number,
  goal,
  greeting_title,
  greeting_body,
  motivational_quote,
  language,
  created_at
FROM public.greetings;

-- Grant SELECT on the view to the public role so share links can use it
GRANT SELECT ON public.greetings_public TO public;

-- Note: Admins continue to be able to select from `public.greetings` via their role-based policy.
