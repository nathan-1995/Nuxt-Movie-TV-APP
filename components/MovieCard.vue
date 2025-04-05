<!-- components/MovieCard.vue -->
<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div class="relative pb-[150%]">
        <img 
          v-if="posterPath" 
          :src="`https://image.tmdb.org/t/p/w500${posterPath}`" 
          :alt="title"
          class="absolute inset-0 w-full h-full object-cover"
        >
        <div v-else class="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span class="text-gray-400">No Image</span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg mb-2 line-clamp-1">{{ title }}</h3>
        <div class="flex items-center mb-2">
          <span class="text-yellow-500 mr-1">★</span>
          <span>{{ rating.toFixed(1) }}</span>
        </div>
        <p class="text-sm text-gray-500 line-clamp-2">{{ overview }}</p>
      </div>
    </div>
  </template>
  

<!-- this script is used to define the props that the component will accept, from index.vue -->
  <script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    posterPath: {
      type: String,
      default: null
    },
    overview: {
      type: String,
      default: 'No overview available'
    },
    rating: {
      type: Number,
      default: 0
    }
  })
  </script>