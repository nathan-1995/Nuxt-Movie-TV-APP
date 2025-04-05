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
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRoute, useRouter } from 'vue-router'

const initialized = ref(false)
const { user, initAuth } = useAuth()
const route = useRoute()
const router = useRouter()

// Initialize auth and handle redirects
onMounted(async () => {
  await initAuth()
  initialized.value = true

  // After initialization, check authentication state and current route
  handleAuthRedirect()

  // Add event listener for popstate (browser back/forward)
  window.addEventListener('popstate', handleAuthRedirect)
})

// Remove event listener when component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleAuthRedirect)
})

// Watch for changes in authentication state AND route changes
watch([() => user.value, () => route.path], () => {
  if (initialized.value) {
    handleAuthRedirect()
  }
})

// Function to handle authentication-based redirects
function handleAuthRedirect() {
  const publicRoutes = ['/login', '/signup']
  const currentPath = route.path

  // If user is not authenticated and not on a public route, redirect to login
  if (!user.value && !publicRoutes.includes(currentPath)) {
    router.replace('/login')
  }

  // If user is authenticated and on a public route, redirect to home
  if (user.value && publicRoutes.includes(currentPath)) {
    router.replace('/')
  }
}
</script>