<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type Tab = 'login' | 'admin' | 'register'

const activeTab = ref<Tab>('login')
const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const endpoints: Record<Tab, string> = {
  login: `${import.meta.env.VITE_API_URL}/auth/login`,
  admin: `${import.meta.env.VITE_API_URL}/auth/admin/login`,
  register: `${import.meta.env.VITE_API_URL}/auth/register`,
}

function switchTab(tab: Tab) {
  activeTab.value = tab
  error.value = ''
  password.value = ''
}

async function handleSubmit() {
  error.value = ''

  const body =
    activeTab.value === 'admin'
      ? { username: username.value, password: password.value }
      : { username: username.value }

  try {
    const res = await fetch(endpoints[activeTab.value], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || 'Une erreur est survenue')
    }

    const data = await res.json()
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('role', data.role)

    router.push('/')
  } catch (e) {
    error.value = (e as Error).message
  }
}
</script>

<template>
  <div class="login-page">
    <div class="tabs">
      <button
        :class="{ active: activeTab === 'login' }"
        @click="switchTab('login')"
      >
        Connexion
      </button>
      <button
        :class="{ active: activeTab === 'admin' }"
        @click="switchTab('admin')"
      >
        Connexion admin
      </button>
      <button
        :class="{ active: activeTab === 'register' }"
        @click="switchTab('register')"
      >
        Inscription
      </button>
    </div>

    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nom d'utilisateur</label>
        <input v-model="username" required />
      </div>

      <div v-if="activeTab === 'admin'">
        <label>Mot de passe</label>
        <input v-model="password" type="password" required />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">
        {{ activeTab === 'register' ? "S'inscrire" : 'Se connecter' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  max-width: 320px;
  margin: 4rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tabs button {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
}

.tabs button.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error {
  color: red;
}
</style>