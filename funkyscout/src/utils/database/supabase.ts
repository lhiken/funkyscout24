import { createClient } from "@supabase/supabase-js";
import { Database } from './database.types.ts'

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY || "";

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;