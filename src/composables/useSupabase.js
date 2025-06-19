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
      // ⚠️ Sécurité: Masquer le mot de passe dans les logs
      const maskedPassword = password.length > 0 ? password.substring(0, 3) + '*'.repeat(Math.max(0, password.length - 3)) : '[vide]'
      console.log('🔐 Tentative de connexion:', { username, password: maskedPassword })
      
      const { data, error } = await supabase
        .rpc('authenticate_user', {
          username_input: username,
          password_input: password
        })
      
      console.log('📡 Réponse RPC authenticate_user:', { data, error })
      
      if (error) {
        console.error('❌ Erreur RPC:', error)
        throw error
      }
      
      if (data && data.length > 0) {
        const user = data[0]
        console.log('✅ Utilisateur authentifié:', user)
        currentUser.value = user
        
        // Store in localStorage for persistence
        localStorage.setItem('onuf_user', JSON.stringify(user))
        localStorage.setItem('onuf_token', user.token)
        
        return { success: true, user }
      } else {
        console.log('❌ Aucun utilisateur retourné par la fonction RPC')
        return { success: false, error: 'Identifiants incorrects' }
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
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
  
  const resetUserPassword = async (username, newPassword) => {
    try {
      console.log(`🔄 Reset password pour ${username}`)
      const { data, error } = await supabase
        .rpc('reset_user_password', {
          username_input: username,
          new_password: newPassword
        })
      
      if (error) throw error
      console.log('✅ Mot de passe mis à jour')
      return { success: true }
    } catch (error) {
      console.error('❌ Erreur reset password:', error)
      return { success: false, error: error.message }
    }
  }
  
  const testPasswordHash = async (username, password) => {
    try {
      const { data, error } = await supabase
        .rpc('test_password_hash', {
          username_input: username,
          password_input: password
        })
      
      console.log('🧪 Test hash result:', data)
      return { success: true, data }
    } catch (error) {
      console.error('❌ Erreur test hash:', error)
      return { success: false, error: error.message }
    }
  }
  
  const debugUserInfo = async (username) => {
    try {
      const { data, error } = await supabase
        .rpc('debug_user_info', {
          username_input: username
        })
      
      console.log(`🔍 Info utilisateur ${username}:`, data)
      return { success: true, data }
    } catch (error) {
      console.error('❌ Erreur debug user:', error)
      return { success: false, error: error.message }
    }
  }
  
  const checkAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .rpc('check_all_users')
      
      console.log('📋 Tous les utilisateurs:', data)
      return { success: true, data }
    } catch (error) {
      console.error('❌ Erreur check users:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Méthode de fallback pour l'authentification (si RPC échoue)
  const loginDirect = async (username, password) => {
    try {
      console.log('🔄 Tentative de login direct (fallback)')
      
      // Récupérer l'utilisateur directement
      const { data: users, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .limit(1)
      
      if (fetchError) {
        console.error('❌ Erreur fetch user:', fetchError)
        throw fetchError
      }
      
      if (!users || users.length === 0) {
        console.log('❌ Aucun utilisateur trouvé avec ce nom d\'utilisateur')
        return { success: false, error: 'Utilisateur introuvable' }
      }
      
      const user = users[0]
      console.log('👤 Utilisateur trouvé:', { id: user.id, username: user.username, role: user.role })
      
      // Vérifier le mot de passe avec la fonction test_password_hash
      const hashCheck = await testPasswordHash(username, password)
      
      if (hashCheck.success && hashCheck.data && hashCheck.data.length > 0) {
        const hashResult = hashCheck.data[0]
        console.log('🧪 Résultat vérification hash:', hashResult)
        
        if (hashResult.is_match) {
          // Créer un token simple
          const token = `onuf_token_${user.id}_${Date.now()}`
          
          // Mettre à jour last_login
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              last_login: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
          
          if (updateError) {
            console.warn('⚠️ Erreur mise à jour last_login:', updateError)
          }
          
          // Retourner le résultat
          const authUser = {
            id: user.id,
            username: user.username,
            display_name: user.display_name,
            role: user.role,
            is_active: user.is_active,
            token: token
          }
          
          console.log('✅ Authentification fallback réussie:', authUser)
          return { success: true, user: authUser }
        } else {
          console.log('❌ Mot de passe incorrect (fallback)')
          return { success: false, error: 'Mot de passe incorrect' }
        }
      } else {
        console.log('❌ Échec vérification hash (fallback)')
        return { success: false, error: 'Erreur de vérification' }
      }
      
    } catch (error) {
      console.error('❌ Erreur login direct:', error)
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
    createUser,
    resetUserPassword,
    testPasswordHash,
    debugUserInfo,
    checkAllUsers,
    loginDirect
  }
}

// Initialize auth on app start
export const initAuth = () => {
  const { checkAuthStatus } = useAuth()
  checkAuthStatus()
}
