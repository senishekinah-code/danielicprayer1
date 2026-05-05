-- Replace the always-true update policy with a token-gated one
DROP POLICY "Anyone can update attendance" ON public.attendance;

ALTER TABLE public.attendance
  ADD COLUMN edit_token uuid NOT NULL DEFAULT gen_random_uuid();

-- Hide edit_token from public SELECT by recreating the SELECT policy via column-level grants
REVOKE SELECT ON public.attendance FROM anon, authenticated;
GRANT SELECT (id, day, full_name, phone, group_name, learned, answers, created_at)
  ON public.attendance TO anon, authenticated;

-- Update policy: caller must provide matching edit_token via PostgREST header / payload match
CREATE POLICY "Owner can update with token"
  ON public.attendance FOR UPDATE
  TO anon, authenticated
  USING (edit_token = COALESCE(
    NULLIF(current_setting('request.headers', true)::jsonb ->> 'x-edit-token', ''),
    ''
  )::uuid)
  WITH CHECK (
    char_length(full_name) BETWEEN 2 AND 100
    AND char_length(phone) BETWEEN 7 AND 20
    AND learned IS NOT NULL
    AND char_length(learned) BETWEEN 5 AND 5000
    AND answers IS NOT NULL
    AND jsonb_typeof(answers) = 'array'
  );