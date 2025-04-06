<!-- pages/my-lists.vue -->
<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-slate-900">Your Lists</h1>
      
      <!-- Favorites Section -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4 text-slate-900">Favorites</h2>
        
        <div v-if="loadingFavorites" class="py-4 text-center">
          <div class="animate-spin h-8 w-8 border-4 border-slate-900 rounded-full border-t-transparent mx-auto"></div>
        </div>
        
        <div v-else-if="favoriteError" class="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          Error loading favorites: {{ favoriteError.message }}
        </div>
        
        <div v-else-if="favorites.length === 0" class="text-gray-500 p-4 text-center">
          You haven't added any favorites yet.
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left">Poster</th>
                <th class="py-3 px-4 text-left">Title</th>
                <th class="py-3 px-4 text-left">Category</th>
                <th class="py-3 px-4 text-left">Added Date</th>
                <th class="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in favorites" :key="item.id" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4 w-20">
                  <img 
                    v-if="item.poster_path" 
                    :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`" 
                    :alt="item.title"
                    class="w-16 rounded"
                  >
                  <div v-else class="w-16 h-24 bg-gray-200 flex items-center justify-center rounded">
                    <span class="text-xs text-gray-400">No Image</span>
                  </div>
                </td>
                <td class="py-3 px-4 font-medium">{{ item.title }}</td>
                <td class="py-3 px-4">
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="item.movie_type === 'movie' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                  >
                    {{ item.movie_type === 'movie' ? 'Movie' : 'TV Show' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-500">{{ formatDate(item.created_at) }}</td>
                <td class="py-3 px-4">
                  <button 
                    @click="removeFromFavorites(item.id)" 
                    class="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Watchlist Section -->
      <div>
        <h2 class="text-2xl font-bold mb-4 text-slate-900">Watchlist</h2>
        
        <div v-if="loadingWatchlist" class="py-4 text-center">
          <div class="animate-spin h-8 w-8 border-4 border-slate-900 rounded-full border-t-transparent mx-auto"></div>
        </div>
        
        <div v-else-if="watchlistError" class="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          Error loading watchlist: {{ watchlistError.message }}
        </div>
        
        <div v-else-if="watchlist.length === 0" class="text-gray-500 p-4 text-center">
          You haven't added anything to your watchlist yet.
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left">Poster</th>
                <th class="py-3 px-4 text-left">Title</th>
                <th class="py-3 px-4 text-left">Category</th>
                <th class="py-3 px-4 text-left">Added Date</th>
                <th class="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in watchlist" :key="item.id" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4 w-20">
                  <img 
                    v-if="item.poster_path" 
                    :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`" 
                    :alt="item.title"
                    class="w-16 rounded"
                  >
                  <div v-else class="w-16 h-24 bg-gray-200 flex items-center justify-center rounded">
                    <span class="text-xs text-gray-400">No Image</span>
                  </div>
                </td>
                <td class="py-3 px-4 font-medium">{{ item.title }}</td>
                <td class="py-3 px-4">
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="item.movie_type === 'movie' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                  >
                    {{ item.movie_type === 'movie' ? 'Movie' : 'TV Show' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-500">{{ formatDate(item.created_at) }}</td>
                <td class="py-3 px-4">
                  <button 
                    @click="removeFromWatchlist(item.id)" 
                    class="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAuth } from '~/composables/useAuth'
  
  const { user } = useAuth()
  
  // State for favorites
  const favorites = ref([])
  const loadingFavorites = ref(true)
  const favoriteError = ref(null)
  
  // State for watchlist
  const watchlist = ref([])
  const loadingWatchlist = ref(true)
  const watchlistError = ref(null)
  
  // Fetch data on component mount
  onMounted(async () => {
    if (user.value) {
      await fetchFavorites()
      await fetchWatchlist()
    }
  })
  
  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      loadingFavorites.value = true
      const { useUserLists } = await import('~/composables/useUserLists')
      const { getFavorites } = useUserLists()
      
      const { data, error } = await getFavorites()
      
      if (error) {
        favoriteError.value = error
      } else {
        favorites.value = data || []
      }
    } catch (err) {
      favoriteError.value = err
    } finally {
      loadingFavorites.value = false
    }
  }
  
  // Fetch watchlist
  const fetchWatchlist = async () => {
    try {
      loadingWatchlist.value = true
      const { useUserLists } = await import('~/composables/useUserLists')
      const { getWatchlist } = useUserLists()
      
      const { data, error } = await getWatchlist()
      
      if (error) {
        watchlistError.value = error
      } else {
        watchlist.value = data || []
      }
    } catch (err) {
      watchlistError.value = err
    } finally {
      loadingWatchlist.value = false
    }
  }
  
  // Format date 
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Remove from favorites
  const removeFromFavorites = async (id) => {
    if (confirm('Are you sure you want to remove this from your favorites?')) {
      try {
        const { useUserLists } = await import('~/composables/useUserLists')
        const { removeFromFavorites } = useUserLists()
        
        const { error } = await removeFromFavorites(id)
        
        if (error) {
          alert(`Error: ${error.message || error}`)
        } else {
          // Refresh favorites list by removing the deleted item
          favorites.value = favorites.value.filter(item => item.id !== id)
        }
      } catch (err) {
        alert('Error removing from favorites. Please try again.')
      }
    }
  }
  
  // Remove from watchlist
  const removeFromWatchlist = async (id) => {
    if (confirm('Are you sure you want to remove this from your watchlist?')) {
      try {
        const { useUserLists } = await import('~/composables/useUserLists')
        const { removeFromWatchlist } = useUserLists()
        
        const { error } = await removeFromWatchlist(id)
        
        if (error) {
          alert(`Error: ${error.message || error}`)
        } else {
          // Refresh watchlist by removing the deleted item
          watchlist.value = watchlist.value.filter(item => item.id !== id)
        }
      } catch (err) {
        alert('Error removing from watchlist. Please try again.')
      }
    }
  }
  </script>