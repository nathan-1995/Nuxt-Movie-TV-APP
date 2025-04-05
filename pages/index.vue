<!-- pages/index.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <p v-if="user" class="text-4xl font-bold mb-4 text-slate-900">
        Welcome {{ user.email }} to your
      </p>
      <h1 class="text-4xl font-bold mb-4 text-slate-900">Movie & TV Show App</h1>
      <p class="text-xl text-gray-500">Discover your next favorite movies and TV shows</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div class="bg-gray-50 p-8 rounded-lg shadow-sm transition-all hover:-translate-y-2 hover:shadow-md">
        <h2 class="text-2xl font-bold mb-2 text-slate-900">Browse</h2>
        <p class="text-gray-500">Explore popular movies and TV shows</p>
      </div>
      
      <div class="bg-gray-50 p-8 rounded-lg shadow-sm transition-all hover:-translate-y-2 hover:shadow-md">
        <h2 class="text-2xl font-bold mb-2 text-slate-900">Save</h2>
        <p class="text-gray-500">Create your own watchlist and favorites</p>
      </div>
      
      <div class="bg-gray-50 p-8 rounded-lg shadow-sm transition-all hover:-translate-y-2 hover:shadow-md">
        <h2 class="text-2xl font-bold mb-2 text-slate-900">Discover</h2>
        <p class="text-gray-500">Find personalized recommendations</p>
      </div>
    </div>
    
    <!-- Trending Movies Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-6 text-slate-900">Top 5 Movies This Week</h2>
      
      <div v-if="loadingMovies" class="flex justify-center py-10">
        <div class="animate-spin h-8 w-8 border-4 border-slate-900 rounded-full border-t-transparent"></div>
      </div>
      
      <div v-else-if="movieError" class="bg-red-100 text-red-700 p-4 rounded-lg">
        Failed to load trending movies. Please try again later.
      </div>
      
      <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <MovieCard 
          v-for="movie in trendingMovies" 
          :key="movie.id"
          :id="movie.id"
          :title="movie.title"
          :poster-path="movie.poster_path"
          :overview="movie.overview"
          :rating="movie.vote_average"
          type="movie"
          @open-details="openMovieDetails"
        />
      </div>
    </section>
    
    <!-- Trending TV Shows Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-6 text-slate-900">Top 5 TV Shows This Week</h2>
      
      <div v-if="loadingTVShows" class="flex justify-center py-10">
        <div class="animate-spin h-8 w-8 border-4 border-slate-900 rounded-full border-t-transparent"></div>
      </div>
      
      <div v-else-if="tvShowError" class="bg-red-100 text-red-700 p-4 rounded-lg">
        Failed to load trending TV shows. Please try again later.
      </div>
      
      <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <MovieCard 
          v-for="show in trendingTVShows" 
          :key="show.id"
          :id="show.id"
          :title="show.name"
          :poster-path="show.poster_path"
          :overview="show.overview"
          :rating="show.vote_average"
          type="tv"
          @open-details="openMovieDetails"
        />
      </div>
    </section>
    
    <div v-if="!user" class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <NuxtLink to="/login" class="py-3 px-8 border border-slate-900 text-slate-900 font-medium rounded-md hover:bg-gray-50 transition">
        Log In
      </NuxtLink>
      <NuxtLink to="/signup" class="py-3 px-8 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition">
        Sign Up
      </NuxtLink>
    </div>

    <!-- Movie Details Modal -->
    <MovieModal
      :is-open="isModalOpen"
      :movie-id="selectedMovieId"
      :type="selectedMovieType"
      @close="closeModal"
      @add-to-favorites="handleAddToFavorites"
      @add-to-watchlist="handleAddToWatchlist"
    />
  </div>
</template>

<script setup>

import { useAuth } from '~/composables/useAuth'
import { ref, onMounted } from 'vue'
import { useTMDB } from '~/composables/useTMDB'

const { user } = useAuth()
const { getTrendingMovies, getTrendingTVShows, loading: apiLoading, error: apiError } = useTMDB()

// State for trending movies
const trendingMovies = ref([])
const loadingMovies = ref(false)
const movieError = ref(null)

// State for trending TV shows
const trendingTVShows = ref([])
const loadingTVShows = ref(false)
const tvShowError = ref(null)

// Modal state
const isModalOpen = ref(false)
const selectedMovieId = ref(null)
const selectedMovieType = ref('movie')

// Modal handlers
const openMovieDetails = ({ id, type }) => {
  selectedMovieId.value = id
  selectedMovieType.value = type
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Favorites and watchlist handlers
const handleAddToFavorites = async (item) => {
  try {
    // Import dynamically to avoid initialization errors
    const { useUserLists } = await import('~/composables/useUserLists')
    const { addToFavorites } = useUserLists()
    
    const { data, error } = await addToFavorites(item)
    
    if (error) {
      alert(`Error adding to favorites: ${error.message || error}`)
    } else if (data && data.alreadyExists) {
      // This item is already in favorites
      alert('This item is already in your favorites!')
    } else {
      alert('Added to favorites successfully!')
      closeModal()
    }
  } catch (err) {
    console.error('Error with favorites:', err)
    alert('Could not add to favorites. Please try again later.')
  }
}

const handleAddToWatchlist = async (item) => {
  try {
    // Import dynamically to avoid initialization errors
    const { useUserLists } = await import('~/composables/useUserLists')
    const { addToWatchlist } = useUserLists()
    
    const { data, error } = await addToWatchlist(item)
    
    if (error) {
      alert(`Error adding to watchlist: ${error.message || error}`)
    } else if (data && data.alreadyExists) {
      // This item is already in watchlist
      alert('This item is already in your watchlist!')
    } else {
      alert('Added to watchlist successfully!')
      closeModal()
    }
  } catch (err) {
    console.error('Error with watchlist:', err)
    alert('Could not add to watchlist. Please try again later.')
  }
}

// Fetch data on component mount
onMounted(async () => {
  try {
    // Fetch trending movies
    loadingMovies.value = true // Set loading state
    const movies = await getTrendingMovies('week')
    trendingMovies.value = movies.slice(0, 5) // Get only top 5
  } catch (err) {
    console.error('Error fetching trending movies:', err)
    movieError.value = err
  } finally {
    loadingMovies.value = false // Ensure loading state is reset
  }
  
  try {
    // Fetch trending TV shows
    loadingTVShows.value = true
    const shows = await getTrendingTVShows('week')
    trendingTVShows.value = shows.slice(0, 5) // Get only top 5
  } catch (err) {
    console.error('Error fetching trending TV shows:', err)
    tvShowError.value = err
  } finally {
    loadingTVShows.value = false
  }
})
</script>