<!-- Description: This is the login page for the application. It allows users to log in using their email and password. -->
<!-- pages/login.vue -->
<template>
  <div class="flex justify-center items-center min-h-screen p-8 bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-8 text-center text-slate-900">Log In</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block mb-2 font-medium">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            placeholder="Enter your email"
            class="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        
        <div class="mb-4">
          <label for="password" class="block mb-2 font-medium">Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
            placeholder="Enter your password"
            class="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        
        <div v-if="authError" class="text-red-600 mt-2 text-sm">
          {{ authError.message }}
        </div>
        
        <button 
          type="submit" 
          class="w-full py-3 mt-4 bg-slate-900 text-white rounded text-base cursor-pointer transition hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm">
        Don't have an account? 
        <NuxtLink to="/signup" class="text-slate-900 font-medium underline">Sign Up</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

// Middleware to prevent logged-in users from accessing the login page
definePageMeta({
  middleware: [
    function auth(to, from) {
      const { user } = useAuth()
      if (user.value) {
        return navigateTo('/')
      }
    }
  ]
})

const { signIn, loading, authError } = useAuth()

const email = ref('')
const password = ref('')

// Function to handle login
const handleLogin = async () => {
  try {
    const { user, error } = await signIn(email.value, password.value)
    
    if (user && !error) {
      // Redirect to home page after successful login
      navigateTo('/')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

</script>