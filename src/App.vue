<template>
  <div id="app">
    <nav>
      <!-- Utilisateur NON connecté : montrer Login / Register -->
      <template v-if="!currentUser">
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </template>

      <!-- Utilisateur connecté : montrer Home + Déconnexion -->
      <template v-else>
        <router-link to="/home">Home</router-link>
        <button class="nav-button" @click="logout">Déconnexion</button>
      </template>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const currentUser = ref(null);
const router = useRouter();
const auth = getAuth();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
  });
});

const logout = async () => {
  try {
    await signOut(auth);
    currentUser.value = null;
    router.push('/login');
  } catch (e) {
    console.error('Erreur lors de la déconnexion :', e);
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  background: #f5f7fb;
}

nav {
  padding: 16px 32px;
  display: flex;
  justify-content: center;
  gap: 18px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;

  a {
    font-weight: 600;
    color: #2c3e50;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 999px;
    transition: background 0.15s ease, color 0.15s ease;

    &.router-link-exact-active {
      background: #42b983;
      color: #ffffff;
    }

    &:hover {
      background: rgba(66, 185, 131, 0.12);
    }
  }

  .nav-button {
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    background: #e74c3c;
    color: #ffffff;
    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;

    &:hover {
      background: #c0392b;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
    }
  }
}
</style>
