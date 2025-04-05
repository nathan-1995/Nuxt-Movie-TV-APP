// Description: This file contains a composable function to manage user lists (favorites and watchlist).
// It provides methods to add items to favorites/watchlist and retrieve user's saved items.

import { ref } from 'vue'
import { useAuth } from './useAuth'
import { useSupabase } from './useSupabase'

// Define interfaces for our item types
interface MediaItem {
  movieId: number;
  movieType: string;
  title: string;
  posterPath: string | null;
}

type ErrorType = Error | null;

// Export the useUserLists function as a composable
// This function will be used to manage user's favorites and watchlist
export function useUserLists() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  
  const loading = ref(false)
  const error = ref<ErrorType>(null)
  
  // Add to favorites
  const addToFavorites = async (item: MediaItem) => {
    if (!user.value) {
      return { error: new Error('User not authenticated') }
    }
    
    loading.value = true
    error.value = null
    
    try {
      // Check if item is already in favorites
      const { data: existingItem, error: checkError } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.value.id)
        .eq('movie_id', item.movieId)
        .eq('movie_type', item.movieType)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is a specific error code for "No rows found"
        throw checkError;
      }
      
      if (existingItem) {
        return { data: { ...existingItem, alreadyExists: true }, error: null } // Item already exists in favorites
      }
      
      // Add to favorites
      const { data, error: insertError } = await supabase
        .from('favorites')
        .insert({
          user_id: user.value.id,
          movie_id: item.movieId,
          movie_type: item.movieType,
          title: item.title,
          poster_path: item.posterPath
        })
        .select()
      
      if (insertError) {
        throw insertError;
      }
      
      return { data, error: null } // Return the newly added item

    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      return { data: null, error: err } 

    } finally {
      loading.value = false // Reset loading state
    }
  }
  
  // Add to watchlist
  const addToWatchlist = async (item: MediaItem) => {
    if (!user.value) {
      return { error: new Error('User not authenticated') }
    }
    
    loading.value = true
    error.value = null
    
    try {
      // Check if item is already in watchlist
      const { data: existingItem, error: checkError } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', user.value.id)
        .eq('movie_id', item.movieId)
        .eq('movie_type', item.movieType)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is a specific error code for "No rows found"
        throw checkError;
      }
      
      if (existingItem) {
        return { data: { ...existingItem, alreadyExists: true }, error: null } // Item already exists in watchlist
      }
      
      // Add to watchlist
      const { data, error: insertError } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.value.id,
          movie_id: item.movieId,
          movie_type: item.movieType,
          title: item.title,
          poster_path: item.posterPath
        })
        .select()
      
      if (insertError) {
        throw insertError;
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      return { data: null, error: err }
    } finally {
      loading.value = false
    }
  }
  
  // Get user's favorites
  const getFavorites = async () => {
    if (!user.value) return { data: [], error: new Error('User not authenticated') }
    
    loading.value = true
    error.value = null
    
    // Fetch user's favorites from the database
    try {
      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })
      
      if (fetchError) {
        throw fetchError;
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      return { data: [], error: err }
    } finally {
      loading.value = false
    }
  }
  
  // Get user's watchlist
  const getWatchlist = async () => {
    if (!user.value) return { data: [], error: new Error('User not authenticated') }
    
    loading.value = true
    error.value = null
    // Fetch user's watchlist from the database
    try {
      const { data, error: fetchError } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })
      
      if (fetchError) {
        throw fetchError;
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      return { data: [], error: err }
    } finally {
      loading.value = false
    }
  }
  
  // Return the functions and state variables
  return {
    loading,
    error,
    addToFavorites,
    addToWatchlist,
    getFavorites,
    getWatchlist
  }
}