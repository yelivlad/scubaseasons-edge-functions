// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { json } from "../_shared/utils";

export const handler = async (req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data, error } = await supabase.from('notifications').select('*').limit(2)

    if (error) {
      throw error
    }

    return json({ data, myMsg: "test1" })
  } catch (err) {
    return json({ message: err?.message ?? err }, 500)
  }
}

Deno.serve(handler);