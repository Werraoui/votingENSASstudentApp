<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="auth-title">Inscription</h2>

      <form class="auth-form" @submit.prevent="registerUser">
        <input
          v-model="email"
          type="email"
          placeholder="Email UCA (@uca.ac.ma)"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Mot de passe"
          required
        />
        <button type="submit" class="primary-btn">S’inscrire</button>
      </form>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <p class="switch-text">
        Déjà un compte ?
        <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const auth = getAuth();
const router = useRouter();

const registerUser = async () => {
  if (!email.value.endsWith('@uca.ac.ma')) {
    errorMessage.value = "L'email doit être un email UCA (@uca.ac.ma)";
    return; // stop l'inscription
  }
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push('/login');
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
  margin-bottom: 6px;
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

.primary-btn {
  width: 100%;
  padding: 10px 14px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  background: #42b983;
  color: #ffffff;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;
}

.primary-btn:hover {
  background: #339a6a;
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.35);
  transform: translateY(-1px);
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