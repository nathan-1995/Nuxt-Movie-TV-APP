<!-- components/MovieModal.vue -->
<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
  
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <!-- Close button -->
                <div class="absolute top-0 right-0 pt-4 pr-4">
                  <button type="button" @click="closeModal" class="bg-white rounded-md text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
  
                <div v-if="loading" class="flex justify-center py-10">
                  <div class="animate-spin h-8 w-8 border-4 border-slate-900 rounded-full border-t-transparent"></div>
                </div>
  
                <div v-else-if="error" class="text-red-500">
                  An error occurred while loading the details. Please try again.
                </div>
  
                <div v-else-if="details" class="sm:flex">
                  <!-- Movie/Show Poster -->
                  <div class="flex-shrink-0 sm:mr-6">
                    <img 
                      v-if="details.poster_path" 
                      :src="`https://image.tmdb.org/t/p/w300${details.poster_path}`" 
                      :alt="details.title || details.name"
                      class="w-full sm:w-48 rounded-md object-cover"
                    >
                    <div v-else class="w-full sm:w-48 h-72 bg-gray-200 flex items-center justify-center rounded-md">
                      <span class="text-gray-400">No Image</span>
                    </div>
                  </div>
  
                  <!-- Movie/Show Details -->
                  <div class="mt-4 sm:mt-0 flex-grow">
                    <h3 id="modal-title" class="text-xl leading-6 font-bold text-gray-900">
                      {{ details.title || details.name }}
                    </h3>
                    
                    <div class="mt-2 flex items-center">
                      <span class="text-yellow-500 mr-1">★</span>
                      <span>{{ details.vote_average?.toFixed(1) || 'N/A' }}</span>
                      <span class="mx-2">•</span>
                      <span>{{ formatReleaseDate(details.release_date || details.first_air_date) }}</span>
                      <span v-if="type === 'movie' && details.runtime" class="mx-2">•</span>
                      <span v-if="type === 'movie' && details.runtime">{{ formatRuntime(details.runtime) }}</span>
                    </div>
                    
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span 
                        v-for="genre in details.genres" 
                        :key="genre.id"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {{ genre.name }}
                      </span>
                    </div>
                    
                    <p class="mt-4 text-sm text-gray-500">
                      {{ details.overview || 'No overview available' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="addToFavorites" 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Add to Favorites
            </button>
            <button 
              @click="addToWatchlist" 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { useTMDB } from '~/composables/useTMDB'
  import { useAuth } from '~/composables/useAuth'
  
  const props = defineProps({
    isOpen: Boolean,
    movieId: Number,
    type: {
      type: String,
      validator: (value) => ['movie', 'tv'].includes(value),
      default: 'movie'
    }
  })
  
  const emit = defineEmits(['close', 'addToFavorites', 'addToWatchlist'])
  
  const { getMovieDetails, getTVShowDetails } = useTMDB()
  const { user } = useAuth()
  
  const details = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Fetch details when modal opens and movie ID changes
  watch(
    () => [props.isOpen, props.movieId, props.type],
    async ([isOpen, id, type]) => {
      if (isOpen && id) {
        loading.value = true
        error.value = null
        details.value = null
        
        try {
          if (type === 'movie') {
            details.value = await getMovieDetails(id)
          } else {
            details.value = await getTVShowDetails(id)
          }
        } catch (err) {
          error.value = err
        } finally {
          loading.value = false
        }
      }
    },
    { immediate: true }
  )
  
  const closeModal = () => {
    emit('close')
  }
  
  const addToFavorites = () => {
    if (!user.value) {
      alert('Please log in to add to favorites')
      return
    }
    emit('addToFavorites', {
      movieId: props.movieId,
      movieType: props.type,
      title: details.value?.title || details.value?.name,
      posterPath: details.value?.poster_path
    })
  }
  
  const addToWatchlist = () => {
    if (!user.value) {
      alert('Please log in to add to watchlist')
      return
    }
    emit('addToWatchlist', {
      movieId: props.movieId,
      movieType: props.type,
      title: details.value?.title || details.value?.name,
      posterPath: details.value?.poster_path
    })
  }
  
  // Helper functions
  const formatReleaseDate = (date) => {
    if (!date) return 'Unknown date'
    return new Date(date).getFullYear()
  }
  
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }
  </script>