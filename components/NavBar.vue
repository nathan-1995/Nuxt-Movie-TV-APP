<!-- Description: This is a Vue component for a navigation bar that includes links to different pages and a logout button. -->
<!-- components/NavBar.vue -->
<template>
  <nav class="bg-slate-900 text-white py-4">
    <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
      <NuxtLink to="/" class="text-2xl font-bold text-white no-underline">
        Movie/TV Show Finder
      </NuxtLink>
      
      <div class="flex items-center gap-6">
        <template v-if="user">
          <NuxtLink to="/favorites" class="text-white no-underline hover:underline">Favorites</NuxtLink>
          <NuxtLink to="/watchlist" class="text-white no-underline hover:underline">Watchlist</NuxtLink>
          <button @click="handleLogout" 
                  class="border border-white text-white py-2 px-4 rounded hover:bg-white/10 transition">
            {{ loading ? 'Logging out...' : 'Log Out' }}
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="text-white no-underline hover:underline">Log In</NuxtLink>
          <NuxtLink to="/signup" 
                    class="bg-white text-slate-900 py-2 px-4 rounded font-medium hover:bg-gray-100 transition">
            Sign Up
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const { signOut, user, loading } = useAuth()

const handleLogout = async () => {
  await signOut()
  navigateTo('/')
}
</script>