import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// This prevents the "Key is required" crash during the build phase
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: false // Recommended for Next.js SSR/Static builds
    }
  }
)