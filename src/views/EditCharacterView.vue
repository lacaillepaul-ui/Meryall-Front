<template>
  <div class="page">
    <p v-if="isLoading">Chargement...</p>

    <template v-else-if="localCharacter">
      <h1>{{ localCharacter.name }}</h1>

      <nav class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tabs__btn"
          :class="{ 'tabs__btn--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <div class="tab-content">
        <div v-if="activeTab === 'identite'" class="tab-panel">
          <label for="character-name">Nom</label>
          <input
            id="character-name"
            v-model="localCharacter.name"
            type="text"
            placeholder="Nom du personnage"
          />
        </div>

        <div v-else-if="activeTab === 'autre'" class="tab-panel">
          <p>Contenu à venir...</p>
        </div>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="page__actions">
        <button class="btn btn-primary" :disabled="isSaving" @click="saveCharacter">
          {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </template>

    <p v-else class="error-message">Personnage introuvable.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

interface ICharacter {
  id: number
  name: string
  owner_id: string
}

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { token } = useAuth()
const apiUrl = import.meta.env.VITE_API_URL

const localCharacter = ref<ICharacter | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

const tabs = [
  { id: 'identite', label: 'Identité' },
  { id: 'autre', label: 'Autre' },
] as const

const activeTab = ref<(typeof tabs)[number]['id']>('identite')

async function fetchCharacter() {
  isLoading.value = true
  try {
    const response = await fetch(`${apiUrl}/characters/${props.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    if (!response.ok) throw new Error('Personnage introuvable')
    localCharacter.value = await response.json()
  } catch (e) {
    console.error(e)
    localCharacter.value = null
  } finally {
    isLoading.value = false
  }
}

async function saveCharacter() {
  if (!localCharacter.value) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${apiUrl}/characters/${localCharacter.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ name: localCharacter.value.name }),
    })

    if (!response.ok) throw new Error('Erreur lors de la sauvegarde')

    router.push({ name: 'fiches' })
  } catch (e) {
    errorMessage.value = 'Impossible d’enregistrer le personnage'
    console.error(e)
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchCharacter)
</script>

<style scoped>
.page {
  padding: 2rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1.5rem;
}

.tabs__btn {
  padding: 0.6rem 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  border-bottom: 3px solid transparent;
}

.tabs__btn:hover {
  color: #000091;
}

.tabs__btn--active {
  color: #000091;
  border-bottom-color: #000091;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
}

.tab-panel label {
  font-weight: 600;
}

.tab-panel input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.page__actions {
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background-color: #000091;
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #c00;
  margin-top: 0.75rem;
}
</style>
