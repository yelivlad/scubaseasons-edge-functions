import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { json } from "@shared/utils.ts";

export const handler = async (req: Request) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    let data: unknown = null;
    let dbStatus: "ok" | "skipped" = "skipped";

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const supabase = createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
      );

      const { data: rows, error } = await supabase.from("notifications").select("*").limit(2);
      if (error) throw error;
      data = rows;
      dbStatus = "ok";
    }

    return json({ ok: true, data, dbStatus, myMsg: "test4" });
  } catch (err: any) {
    return json({ ok: false, message: err?.message ?? String(err) }, 500);
  }
};

Deno.serve(handler);
