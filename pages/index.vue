<!-- This is the main page of the application, which serves as a landing page for users. -->
<!-- pages/index.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 py-8 text-center">
    <h1 class="text-4xl font-bold mb-4 text-slate-900">Movie & TV Show App</h1>
    <p class="text-xl text-gray-500 mb-12">Discover your next favorite movies and TV shows</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div class="bg-gray-50 p-8 rounded-lg shadow-sm transition-all hover:transform hover:-translate-y-2 hover:shadow-md">
        <h2 class="text-2xl font-bold mb-2 text-slate-900">Browse</h2>
        <p class="text-gray-500">Explore popular movies and TV shows</p>
      </div>
      
      <div class="bg-gray-50 p-8 rounded-lg shadow-sm transition-all hover:transform hover:-translate-y-2 hover:shadow-md">
        <h2 class="text-2xl font-bold mb-2 text-slate-900">Save</h2>
        <p class="text-gray-500">Create your own watchlist and favorites</p>
      </div>
      
      <div class="bg-gray-50 p-8 rounded-lg shadow-sm transition-all hover:transform hover:-translate-y-2 hover:shadow-md">
        <h2 class="text-2xl font-bold mb-2 text-slate-900">Discover</h2>
        <p class="text-gray-500">Find personalized recommendations</p>
      </div>
    </div>
    
    <div v-if="!user" class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <NuxtLink to="/login" class="py-3 px-8 border border-slate-900 text-slate-900 font-medium rounded-md hover:bg-gray-50 transition">
        Log In
      </NuxtLink>
      <NuxtLink to="/signup" class="py-3 px-8 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition">
        Sign Up
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()
</script>