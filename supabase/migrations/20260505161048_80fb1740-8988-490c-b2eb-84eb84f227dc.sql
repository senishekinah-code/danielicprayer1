ALTER TABLE public.attendance
  ADD COLUMN learned text,
  ADD COLUMN answers jsonb;

-- Tighten insert policy to require learned + answers
DROP POLICY "Anyone can insert attendance" ON public.attendance;

CREATE POLICY "Anyone can insert attendance"
  ON public.attendance FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 2 AND 100
    AND char_length(phone) BETWEEN 7 AND 20
    AND learned IS NOT NULL
    AND char_length(learned) BETWEEN 5 AND 5000
    AND answers IS NOT NULL
    AND jsonb_typeof(answers) = 'array'
  );