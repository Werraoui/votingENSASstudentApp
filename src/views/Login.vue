<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="auth-title">Connexion</h2>

      <form class="auth-form" @submit.prevent="loginUser">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          required
        />
        <button type="submit" class="primary-btn">Se connecter</button>
      </form>

      <button class="secondary-btn google-btn" @click="loginWithGoogle">
        Continuer avec Google
      </button>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <p class="switch-text">
        Pas encore de compte ?
        <router-link to="/register">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const auth = getAuth();
const router = useRouter();

const loginUser = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/home');
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const loginWithGoogle = async () => {
  errorMessage.value = '';
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/home');
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 24px 20px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  text-align: left;
}

.auth-title {
  margin: 0 0 16px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2933;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.auth-form input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0d7e2;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.auth-form input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.primary-btn,
.secondary-btn {
  width: 100%;
  padding: 10px 14px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;
}

.primary-btn {
  background: #42b983;
  color: #ffffff;
}

.primary-btn:hover {
  background: #339a6a;
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.35);
  transform: translateY(-1px);
}

.secondary-btn {
  background: #f1f5f9;
  color: #111827;
  margin-top: 6px;
}

.secondary-btn:hover {
  background: #e2e8f0;
}

.google-btn {
  margin-top: 4px;
}

.error-text {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #e11d48;
}

.switch-text {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #4b5563;
}

.switch-text a {
  color: #42b983;
  font-weight: 600;
  text-decoration: none;
}

.switch-text a:hover {
  text-decoration: underline;
}
</style>