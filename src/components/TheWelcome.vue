<script setup>
// Composant d'accueil simplifié pour MANARA
</script>

<template>
  <div class="welcome-container">
    <h1 class="app-title">MANARA</h1>
    <p class="app-subtitle">Votre solution de gestion d'audits terrain</p>
    
    <div class="features-grid">
      <div class="feature-card">
        <h3>Audits</h3>
        <p>Créez et gérez facilement vos audits terrain</p>
      </div>
      
      <div class="feature-card">
        <h3>Localisation</h3>
        <p>Enregistrement précis des positions GPS</p>
      </div>
      
      <div class="feature-card">
        <h3>Photos</h3>
        <p>Capturez et gérez vos photos d'audit</p>
      </div>
      
      <div class="feature-card">
        <h3>Hors-ligne</h3>
        <p>Fonctionne même sans connexion internet</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.app-title {
  font-size: 4rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.app-subtitle {
  font-size: 1.5rem;
  color: #7f8c8d;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 3rem;
  }
  
  .app-subtitle {
    font-size: 1.2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
