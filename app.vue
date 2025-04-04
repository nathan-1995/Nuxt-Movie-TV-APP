<!-- Description: This is the main entry point for the  app. It initializes the authentication state and handles loading states. -->
<!-- app.vue -->
<template>
  <div v-if="initialized">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <div v-else class="h-screen w-screen flex items-center justify-center">
    <!-- Loading spinner or placeholder -->
    <div class="animate-spin h-10 w-10 border-4 border-slate-900 rounded-full border-t-transparent"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const initialized = ref(false)
const { initAuth } = useAuth()

// Middleware to prevent logged-in users from accessing the app
onMounted(async () => {
  await initAuth()
  initialized.value = true
})
</script>