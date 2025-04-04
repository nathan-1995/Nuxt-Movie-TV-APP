// Description: Middleware to protect routes based on authentication status
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const user = useState('user')
    
    // If not authenticated and trying to access a protected route, redirect to login
    if (!user.value && to.path !== '/login' && to.path !== '/signup') {
      return navigateTo('/login')
    }
  })