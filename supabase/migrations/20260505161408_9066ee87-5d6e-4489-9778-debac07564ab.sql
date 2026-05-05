CREATE POLICY "Anyone can update attendance"
  ON public.attendance FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (
    char_length(full_name) BETWEEN 2 AND 100
    AND char_length(phone) BETWEEN 7 AND 20
    AND learned IS NOT NULL
    AND char_length(learned) BETWEEN 5 AND 5000
    AND answers IS NOT NULL
    AND jsonb_typeof(answers) = 'array'
  );