<!-- Description: This is a Vue.js component for a signup page. It includes a form for users to enter their email and password -->
<!-- pages/signup.vue -->
<template>
  <div class="flex justify-center items-center min-h-screen p-8 bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-8 text-center text-slate-900">Create an Account</h1>
      
      <form @submit.prevent="handleSignup">
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
            placeholder="Create a password"
            minlength="6"
            class="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <p class="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
        </div>
        
        <div v-if="authError" class="text-red-600 mt-2 text-sm">
          {{ authError.message }}
        </div>
        
        <button 
          type="submit" 
          class="w-full py-3 mt-4 bg-slate-900 text-white rounded text-base cursor-pointer transition hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm">
        Already have an account? 
        <NuxtLink to="/login" class="text-slate-900 font-medium underline">Log In</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

/// Middleware to prevent logged-in users from accessing the signup page
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

const { signUp, loading, authError } = useAuth()

const email = ref('')
const password = ref('')

const handleSignup = async () => {
  try {
    const { user, error, needsEmailConfirmation } = await signUp(email.value, password.value)
    
    if (error) return // The error will be displayed via authError
    
    // Handle successful signup
    if (needsEmailConfirmation) {
      alert('Check your email for a confirmation link!')
      navigateTo('/login')
    }
  } catch (error) {
    console.error('Signup error:', error)
  }
}
</script>