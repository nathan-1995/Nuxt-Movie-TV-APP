// description: This file contains a composable function to interact with the TMDB API. 
// It provides methods to fetch trending movies/ tvshows, and details for specific movies/tv

import { ref } from 'vue'

type ErrorType = Error | null;

// Export the useTMDB function as a composable
// This function will be used to fetch data from the TMDB API
export function useTMDB() {
  const loading = ref(false)
  const error = ref<ErrorType>(null)
  
  // Get configuration from environment variables
  const config = useRuntimeConfig()
  const apiKey = config.public.tmdbApiKey
  const baseUrl = config.public.tmdbBaseUrl
  
  // Func to
  const getTrendingMovies = async (timeWindow = 'week', page = 1) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `${baseUrl}/trending/movie/${timeWindow}?api_key=${apiKey}&page=${page}` // pass the time window and page to the API
      )
      
      if (!response.ok) {
        throw new Error(`Error fetching trending movies: ${response.status}`)
      }
      
      const data = await response.json()
      return data.results
    } catch (err) {
      console.error('Error fetching trending movies:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Function to get trending TV shows
  const getTrendingTVShows = async (timeWindow = 'week', page = 1) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `${baseUrl}/trending/tv/${timeWindow}?api_key=${apiKey}&page=${page}` // pass the time window and page to the API
      )
      
      if (!response.ok) {
        throw new Error(`Error fetching trending TV shows: ${response.status}`)
      }
      
      const data = await response.json()
      return data.results
    } catch (err) {
      console.error('Error fetching trending TV shows:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Get details for a movie
  const getMovieDetails = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `${baseUrl}/movie/${id}?api_key=${apiKey}` // pass the id of the movie to the API
      )
      
      if (!response.ok) {
        throw new Error(`Error fetching movie details: ${response.status}`)
      }
      
      return await response.json()
    } catch (err) {
      console.error('Error fetching movie details:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      return null
    } finally {
      loading.value = false // set loading to false after the request is complete
    }
  }
  
  // Get details for a TV show
  const getTVShowDetails = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `${baseUrl}/tv/${id}?api_key=${apiKey}` // pass the id of the TV show to the API
      )
      
      if (!response.ok) {
        throw new Error(`Error fetching TV show details: ${response.status}`)
      }
      
      return await response.json()
    } catch (err) {
      console.error('Error fetching TV show details:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Return the functions and state variables
  return {
    loading,
    error,
    getTrendingMovies,
    getTrendingTVShows,
    getMovieDetails,
    getTVShowDetails
  }
}