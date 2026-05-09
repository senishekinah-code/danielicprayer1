import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const fetchAttendanceAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || data.password !== expected) {
      throw new Error("Nywila si sahihi");
    }
    const { data: rows, error } = await supabaseAdmin
      .from("attendance")
      .select("id, day, full_name, phone, group_name, learned, answers, created_at")
      .order("day", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });
