import { createClient } from "@supabase/supabase-js";
import { Database } from './database.types'
import 'dotenv/config'

const supabaseUrl: string = process.env.SUPABASE_URL || '';
const supabaseKey: string = process.env.SUPABASE_KEY || '';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;