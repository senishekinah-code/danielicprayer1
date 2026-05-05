DROP POLICY "Owner can update with token" ON public.attendance;

CREATE OR REPLACE FUNCTION public.update_attendance(
  p_id uuid,
  p_token uuid,
  p_full_name text,
  p_phone text,
  p_group_name text,
  p_learned text,
  p_answers jsonb
)
RETURNS public.attendance
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.attendance;
BEGIN
  IF char_length(p_full_name) NOT BETWEEN 2 AND 100
     OR char_length(p_phone) NOT BETWEEN 7 AND 20
     OR p_learned IS NULL
     OR char_length(p_learned) NOT BETWEEN 5 AND 5000
     OR p_answers IS NULL
     OR jsonb_typeof(p_answers) <> 'array'
  THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;

  UPDATE public.attendance
     SET full_name = p_full_name,
         phone = p_phone,
         group_name = NULLIF(p_group_name, ''),
         learned = p_learned,
         answers = p_answers
   WHERE id = p_id
     AND edit_token = p_token
   RETURNING * INTO v_row;

  IF v_row.id IS NULL THEN
    RAISE EXCEPTION 'Not found or invalid token';
  END IF;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.update_attendance(uuid, uuid, text, text, text, text, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.update_attendance(uuid, uuid, text, text, text, text, jsonb) TO anon, authenticated;