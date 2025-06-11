<template>
  <v-card>
    <v-card-title class="text-h6">
      📝 Logs de Debug
    </v-card-title>
    <v-card-text>
      <div class="logs-container">
        <div 
          v-for="(log, index) in logs" 
          :key="index"
          :class="`log-entry log-${log.type}`"
        >
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          <span class="log-type">[{{ log.type.toUpperCase() }}]</span>
          <span class="log-message">{{ log.message }}</span>
          <div v-if="log.data" class="log-data">
            <pre>{{ JSON.stringify(log.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
      
      <div v-if="logs.length === 0" class="text-center text-muted py-4">
        Aucun log pour le moment. Exécutez un test pour voir les résultats.
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  logs: {
    type: Array,
    default: () => []
  }
})

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  })
}
</script>

<style scoped>
.logs-container {
  max-height: 400px;
  overflow-y: auto;
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-entry {
  margin-bottom: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #333;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.log-time {
  color: #888;
  font-size: 11px;
  min-width: 80px;
}

.log-type {
  font-weight: bold;
  min-width: 60px;
}

.log-info .log-type {
  color: #2196F3;
}

.log-success .log-type {
  color: #4CAF50;
}

.log-error .log-type {
  color: #F44336;
}

.log-warn .log-type {
  color: #FF9800;
}

.log-message {
  color: #fff;
  flex: 1;
}

.log-data {
  width: 100%;
  margin-top: 4px;
}

.log-data pre {
  background-color: #2a2a2a;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 11px;
  color: #e0e0e0;
  margin: 0;
  white-space: pre-wrap;
}

.text-muted {
  color: #666 !important;
}

@media (max-width: 600px) {
  .logs-container {
    font-size: 11px;
    padding: 12px;
  }
  
  .log-entry {
    flex-direction: column;
    gap: 4px;
  }
  
  .log-time,
  .log-type {
    min-width: auto;
  }
}
</style>
