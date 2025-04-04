// Description: This file contains a composable function to create a Supabase client instance.
// composables/useSupabase.ts
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

// Function to create a Supabase client instance
export function useSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing')
  }
  
  const supabase = createClient(supabaseUrl as string, supabaseKey as string) // Create a Supabase client instance
  
  return { supabase }
}