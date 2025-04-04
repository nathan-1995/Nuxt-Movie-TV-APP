// Description: This plugin initializes the authentication module when the app starts.
// This ensures that authentication state is set up before any routes are accessed.
// plugins/auth.ts
export default defineNuxtPlugin(async (nuxtApp) => {
    const { initAuth } = useAuth()
    
    // Initialize authentication on app startup
    await initAuth()
  })