<template>
  <header v-if="$route.name !== 'login'" class="navbar">
    <nav class="navbar__nav">
      <RouterLink to="/" class="navbar__btn">Accueil</RouterLink>
      <RouterLink to="/fiches" class="navbar__btn">Fiches</RouterLink>
    </nav>
    <p>{{ localStorage }}</p>
    <button class="navbar__logout" @click="logout">
      Déconnexion
    </button>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.navbar__nav {
  display: flex;
  gap: 1rem;
}

.navbar__btn {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.navbar__btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.navbar__btn.router-link-active {
  background-color: rgba(255, 255, 255, 0.25);
  font-weight: bold;
}

.navbar__logout {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}

.navbar__logout:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
</style>