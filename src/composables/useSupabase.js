// src/composables/useSupabase.js
import { createClient } from '@supabase/supabase-js'
import { ref, computed, readonly } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth state
const currentUser = ref(null)
const isAuthenticated = computed(() => !!currentUser.value)
const isAdmin = computed(() => currentUser.value?.role === 'admin')

// Auth functions
export const useAuth = () => {
  
  const login = async (username, password) => {
    try {
      const { data, error } = await supabase
        .rpc('authenticate_user', {
          username_input: username,
          password_input: password
        })
      
      if (error) throw error
      
      if (data && data.length > 0) {
        const user = data[0]
        currentUser.value = user
        
        // Store in localStorage for persistence
        localStorage.setItem('onuf_user', JSON.stringify(user))
        localStorage.setItem('onuf_token', user.token)
        
        return { success: true, user }
      } else {
        return { success: false, error: 'Identifiants incorrects' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }
  
  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('onuf_user')
    localStorage.removeItem('onuf_token')
  }
  
  const checkAuthStatus = () => {
    const stored = localStorage.getItem('onuf_user')
    if (stored) {
      try {
        currentUser.value = JSON.parse(stored)
      } catch (e) {
        logout()
      }
    }
  }
  
  const createUser = async (username, password, displayName) => {
    try {
      const { data, error } = await supabase
        .rpc('create_field_user', {
          username_input: username,
          password_input: password,
          display_name_input: displayName
        })
      
      if (error) throw error
      return { success: true, userId: data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  return {
    currentUser: readonly(currentUser),
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuthStatus,
    createUser
  }
}

// Initialize auth on app start
export const initAuth = () => {
  const { checkAuthStatus } = useAuth()
  checkAuthStatus()
}
