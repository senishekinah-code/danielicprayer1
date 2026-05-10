import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type Row = {
  id: string;
  day: number;
  full_name: string;
  phone: string;
  group_name: string | null;
  learned: string | null;
  answers: Record<string, never>;
  created_at: string;
};

type Result = { ok: true; rows: Row[] } | { ok: false; error: string };

export const fetchAttendanceAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<Result> => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return { ok: false, error: "ADMIN_PASSWORD haijawekwa kwenye server." };
    }
    if (data.password !== expected) {
      return { ok: false, error: "Nywila si sahihi" };
    }
    const { data: rows, error } = await supabaseAdmin
      .from("attendance")
      .select("id, day, full_name, phone, group_name, learned, answers, created_at")
      .order("day", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: (rows ?? []) as Row[] };
  });
