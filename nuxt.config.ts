// nuxt.config.ts
export default defineNuxtConfig({
  // Other config options
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private keys that are exposed to the server
    
    // Public keys that are exposed to the client
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      tmdbApiKey: process.env.TMDB_API_KEY,
      tmdbBaseUrl: process.env.TMDB_BASE_URL,
    }
  },

  compatibilityDate: "2025-04-05",
})