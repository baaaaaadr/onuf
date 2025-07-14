// src/utils/mobileDebug.js
import { ref } from 'vue'

class MobileDebugLogger {
  constructor() {
    this.logs = ref([])
    this.maxLogs = 500
    this.isEnabled = ref(true)
    this.logToFile = false
    
    // Intercepter console.log, error, warn
    this.setupConsoleInterceptors()
    
    // Capturer les erreurs globales
    this.setupErrorHandlers()
  }

  setupConsoleInterceptors() {
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn
    
    // Protéger contre les boucles infinies
    let isLogging = false

    console.log = (...args) => {
      if (!isLogging && this.shouldLog(args)) {
        isLogging = true
        this.addLog('log', args)
        isLogging = false
      }
      originalLog.apply(console, args)
    }

    console.error = (...args) => {
      if (!isLogging && this.shouldLog(args)) {
        isLogging = true
        this.addLog('error', args)
        isLogging = false
      }
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      if (!isLogging && this.shouldLog(args)) {
        isLogging = true
        this.addLog('warn', args)
        isLogging = false
      }
      originalWarn.apply(console, args)
    }
  }
  
  // Méthode pour filtrer les messages qui pourraient causer des boucles
  shouldLog(args) {
    const message = args.join(' ')
    
    // Ignorer les messages i18n qui peuvent causer des boucles
    if (message.includes('[intlify]') || 
        message.includes('Not found') && message.includes('key in') ||
        message.includes('Fall back to translate') ||
        message.includes('audit.photos.widget.gallery') || // ✅ Filtre toute la section gallery photos
        message.includes('menu.debug') || // ✅ Filtre menu debug
        message.includes('errors.gpsUnavailable')) { // ✅ Filtre erreur GPS
      return false
    }
    
    return true
  }

  setupErrorHandlers() {
    // Erreurs non gérées
    window.addEventListener('error', (event) => {
      this.addLog('error', [
        'Uncaught Error:',
        event.message,
        'at', event.filename,
        'line:', event.lineno,
        'col:', event.colno
      ])
    })

    // Promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      this.addLog('error', [
        'Unhandled Promise Rejection:',
        event.reason
      ])
    })
  }

  addLog(type, args) {
    if (!this.isEnabled.value) return
    
    try {
      const timestamp = new Date().toISOString()
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2)
          } catch (e) {
            return '[Circular Object]'
          }
        }
        return String(arg)
      }).join(' ')

      const logEntry = {
        id: Date.now() + Math.random(),
        timestamp,
        type,
        message,
        stack: new Error().stack
      }

      this.logs.value.unshift(logEntry)

      // Limiter le nombre de logs
      if (this.logs.value.length > this.maxLogs) {
        this.logs.value = this.logs.value.slice(0, this.maxLogs)
      }

      // Sauvegarder en localStorage de manière asynchrone pour éviter les blocages
      setTimeout(() => this.saveToLocalStorage(), 0)
    } catch (error) {
      // En cas d'erreur dans addLog, ne pas re-logger pour éviter la boucle
      // Juste désactiver temporairement le debug
      this.isEnabled.value = false
      setTimeout(() => {
        this.isEnabled.value = true
      }, 1000)
    }
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('onuf_debug_logs', JSON.stringify(this.logs.value))
    } catch (e) {
      // Si localStorage est plein, vider les anciens logs
      this.logs.value = this.logs.value.slice(0, Math.floor(this.maxLogs / 2))
    }
  }

  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('onuf_debug_logs')
      if (stored) {
        this.logs.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load debug logs:', e)
    }
  }

  clear() {
    this.logs.value = []
    localStorage.removeItem('onuf_debug_logs')
  }

  exportAsText() {
    const text = this.logs.value
      .map(log => `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`)
      .join('\n\n')
    
    return text
  }

  exportAsJSON() {
    return JSON.stringify(this.logs.value, null, 2)
  }

  downloadLogs(format = 'text') {
    const content = format === 'json' ? this.exportAsJSON() : this.exportAsText()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `onuf_debug_logs_${new Date().toISOString()}.${format === 'json' ? 'json' : 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Méthode spéciale pour tracker les appels Supabase
  logSupabaseCall(method, table, data, error = null) {
    const logData = {
      method,
      table,
      data: data ? JSON.stringify(data, null, 2) : null,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    }
    
    this.addLog(error ? 'error' : 'log', [
      `SUPABASE ${method} ${table}:`,
      logData
    ])
  }

  // Méthode pour tracker la géolocalisation
  logGeolocation(position, error = null) {
    if (error) {
      this.addLog('error', ['GEOLOCATION ERROR:', error.message])
    } else {
      this.addLog('log', [
        'GEOLOCATION SUCCESS:',
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toISOString()
        }
      ])
    }
  }
}

// Singleton
const mobileDebugLogger = new MobileDebugLogger()

// Charger les logs existants
mobileDebugLogger.loadFromLocalStorage()

export default mobileDebugLogger

// Exposer globalement pour debug facile
window.__mobileDebug = mobileDebugLogger