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
    }
  },

  compatibilityDate: "2025-04-05",
})