<template>
  <div class="page">
    <div class="page__header">
      <h1>Fiches</h1>
      <button class="btn btn-primary" @click="openNewCharacter">Ajouter</button>
    </div>

    <p v-if="isLoadingFiches">Chargement des fiches...</p>

    <div v-else class="characters-grid">
      <div v-for="character in characters" :key="character.id" class="character-card">
        <h2 class="character-card__title">{{ character.name }}</h2>
        <div class="character-card__actions">
          <button class="btn btn-secondary" @click="openCharacter(character)">Voir</button>
          <button
            v-if="role == 'admin' || (id ? parseInt(character.owner_id) == id : false)"
            class="btn btn-secondary"
            @click="editCharacter(character)"
          >
            Éditer
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isNewCharacterOpen" class="modal-overlay" @click.self="closeNewCharacter">
        <div class="modal">
          <h2>Nouvelle fiche</h2>

          <label for="nom-character">Nom</label>
          <input
            id="nom-character"
            v-model="name"
            type="text"
            placeholder="Nom de la fiche"
            @keyup.enter="newCharacter"
          />

          <p v-if="errorMessage" class="modal__error">{{ errorMessage }}</p>

          <div class="modal__actions">
            <button class="btn btn-secondary" @click="closeNewCharacter">Annuler</button>
            <button class="btn btn-primary" :disabled="isLoading" @click="newCharacter">
              {{ isLoading ? 'Création...' : 'Accepter' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

interface ICharacter {
  id: number
  name: string
  owner_id: string
}

const { token, role, id } = useAuth()
const apiUrl = import.meta.env.VITE_API_URL

const characters = ref<ICharacter[]>([])
const isLoadingFiches = ref(false)

const isNewCharacterOpen = ref(false)
const name = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function fetchCharacters() {
  isLoadingFiches.value = true
  try {
    const response = await fetch(`${apiUrl}/characters`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    if (!response.ok) throw new Error('Erreur lors de la récupération des fiches')
    characters.value = await response.json()
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingFiches.value = false
    console.log(id)
    console.log(characters.value)
  }
}

function openNewCharacter() {
  name.value = ''
  errorMessage.value = ''
  isNewCharacterOpen.value = true
}

function closeNewCharacter() {
  isNewCharacterOpen.value = false
}

async function newCharacter() {
  if (!name.value.trim()) {
    errorMessage.value = 'Le nom est requis'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${apiUrl}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ name: name.value.trim() }),
    })

    if (!response.ok) throw new Error('Erreur lors de la création de la fiche')

    const nouvelleFiche: ICharacter = await response.json()
    characters.value.push(nouvelleFiche)
    closeNewCharacter()
  } catch (e) {
    errorMessage.value = 'Impossible de créer la fiche'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function openCharacter(character: ICharacter) {}
function editCharacter(character: ICharacter) {}

onMounted(fetchCharacters)
</script>

<style scoped>
.page {
  padding: 2rem;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background-color: #000091; /* bleu France, à ajuster selon ta charte */
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #1e1e1e;
  border-color: #ccc;
}

/* Grille 4 colonnes */
.characters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 992px) {
  .characters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .characters-grid {
    grid-template-columns: 1fr;
  }
}

.character-card {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
}

.character-card__title {
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  word-break: break-word;
}

.character-card__actions {
  display: flex;
  gap: 0.5rem;
}

.character-card__actions .btn {
  flex: 1;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal label {
  font-weight: 600;
}

.modal input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.modal__error {
  color: #c00;
  font-size: 0.9rem;
  margin: 0;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
