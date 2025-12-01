<template>
  <div class="home-page">
    <div class="home-container">
      <h1 class="home-title">Événements disponibles</h1>
      <!-- Composant dédié qui récupère les événements depuis Firestore
           et affiche : titre, description, date, votes Yes / No -->
      <EventList />
    </div>
  </div>
</template>

<script setup>
import EventList from '@/components/EventList.vue';
</script>

<style scoped>
.home-page {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}

.home-container {
  width: 100%;
  max-width: 700px;
}

.home-title {
  margin-bottom: 16px;
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: left;
}
</style>
