<template>
  <AuditFormView />
</template>

<script>
// This file now redirects to the refactored AuditFormView
import AuditFormView from './audit-form/AuditFormView.vue'

export default {
  name: 'AuditFormViewWrapper',
  components: {
    AuditFormView
  }
}
</script>
