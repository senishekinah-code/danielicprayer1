CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day integer NOT NULL CHECK (day >= 1 AND day <= 21),
  full_name text NOT NULL,
  phone text NOT NULL,
  group_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX attendance_day_idx ON public.attendance(day);
CREATE INDEX attendance_phone_idx ON public.attendance(phone);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert attendance"
  ON public.attendance FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 2 AND 100
    AND char_length(phone) BETWEEN 7 AND 20
  );

CREATE POLICY "Anyone can view attendance"
  ON public.attendance FOR SELECT
  TO anon, authenticated
  USING (true);