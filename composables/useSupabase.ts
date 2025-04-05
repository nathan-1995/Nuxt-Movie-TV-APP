// Description: This file contains a composable function to create a Supabase client instance.
// composables/useSupabase.ts
import { createClient } from '@supabase/supabase-js'

// Function to create a Supabase client instance
export function useSupabase() {
  // Get runtime config
  const config = useRuntimeConfig()
  
  // Use runtime config with fallback to environment variables
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey
  // Log the values we're using (for debugging)
  console.log('Using Supabase config:', {
    url: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing',
    key: supabaseKey ? 'exists (hidden)' : 'missing'
  })
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing')
    throw new Error('Supabase configuration is missing')
  }
  
  // Create a Supabase client instance
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  return { supabase }
}