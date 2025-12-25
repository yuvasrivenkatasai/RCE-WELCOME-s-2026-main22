-- Add email column to greetings
-- NOTE: This column will store user-provided email addresses. We are creating a separate public view that excludes `email` in a follow-up migration to avoid exposing emails via public SELECT.

ALTER TABLE public.greetings
  ADD COLUMN IF NOT EXISTS email TEXT;
