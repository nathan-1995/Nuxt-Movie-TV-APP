// Description; This file contains a composable function for managing authentication using Supabase.
// composables/useAuth.ts

import { useState, useRuntimeConfig } from 'nuxt/app'
import { createClient } from '@supabase/supabase-js'
import type { User, AuthError } from '@supabase/supabase-js'

export function useAuth() {
  // State management for user, loading state, and auth error
  const user = useState<User | null>('user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)
  const authError = useState<AuthError | null>('auth-error', () => null)

  // Get Supabase client
  const config = useRuntimeConfig()
  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )

  // Get the current user and then set it in the state
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
    return user.value
  }
  
  // Initialize auth - call this on app start
  const initAuth = async () => {
    loading.value = true
    
    try {
      // Get initial session
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user || null
      
      // Set up auth state change listener. Used to update user state when the user logs in or out.
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
      })
      
      return user.value
    } catch (error) {
      console.error('Error initializing auth:', error)
      authError.value = error as AuthError
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    loading.value = true
    authError.value = null
    
    try {
      const { data, error } = await supabase.auth.signUp({ // Sign up with email and password
        email, 
        password,
        options: {
          // Redirect to the login page after email confirmation
          emailRedirectTo: `${window.location.origin}/login`,
        }
      })
      
      if (error) throw error
      
      // commentted out to avoid setting user value here
      // user.value = data.user
      
      // return the user and session data
      return { 
        user: data.user, 
        session: data.session, 
        error: null,
        needsEmailConfirmation: !data.session // if session is null, it means email confirmation is needed
      }
    } catch (error) {
      console.error('Error signing up:', error)
      authError.value = error as AuthError
      return { 
        user: null, 
        session: null, 
        error,
        needsEmailConfirmation: false
      }
    } finally {
      loading.value = false
    }
  }
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    loading.value = true
    authError.value = null
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ // Sign in with email and password
        email,
        password,
      })
      
      if (error) throw error
      
      user.value = data.user
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      authError.value = error as AuthError
      return { user: null, error }
    } finally {
      loading.value = false
    }
  }
  
  // Sign out
  const signOut = async () => {
    loading.value = true
    
    try {
      const { error } = await supabase.auth.signOut() // Sign out the user
      if (error) throw error
      
      user.value = null
      //after log out, redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      authError.value = error as AuthError
    } finally {
      loading.value = false
    }
  }
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user.value
  }
  
  // Return list of functions and state variables
  return {
    user,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    getUser,
    isAuthenticated,
    initAuth
  }
}