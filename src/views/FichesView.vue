<template>
  <div class="min-h-screen bg-ink p-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-4xl text-parchment">Fiches</h1>
      <Button
        class="rounded-none bg-seal hover:bg-seal/90 text-parchment"
        @click="isNewCharacterOpen = true"
      >
        Ajouter
      </Button>
    </div>

    <p v-if="isLoadingCharacters" class="font-body text-parchment/70">Chargement des fiches...</p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        v-for="character in characters"
        :key="character.id"
        class="bg-parchment border-ink/20 rounded-none flex flex-col justify-between"
      >
        <CardHeader>
          <CardTitle class="font-display text-xl text-ink break-words">
            {{ character.name }}
          </CardTitle>
        </CardHeader>
        <CardFooter class="flex gap-2">
          <Button
            variant="outline"
            class="flex-1 rounded-none border-ink/30 text-ink"
            @click="openCharacter(character)"
          >
            Voir
          </Button>
          <Button
            v-if="role === 'admin' || (id ? parseInt(character.owner_id) === id : false)"
            variant="outline"
            class="flex-1 rounded-none border-ink/30 text-ink"
            @click="editCharacter(character)"
          >
            Éditer
          </Button>
        </CardFooter>
      </Card>
    </div>

    <NewCharacterModal
      ref="newCharacterModalRef"
      v-model:open="isNewCharacterOpen"
      :is-loading="isCreating"
      @create="handleCreate"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { fetchCharacters, newCharacter } from '@/services/characterService'
import type { ICharacter } from '@/types/character'
import NewCharacterModal from '@/components/NewCharacterModal.vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

const router = useRouter()
const { token, role, id } = useAuth()

const characters = ref<ICharacter[]>([])
const isLoadingCharacters = ref(false)

const isNewCharacterOpen = ref(false)
const isCreating = ref(false)
const newCharacterModalRef = ref<InstanceType<typeof NewCharacterModal> | null>(null)

async function loadCharacters() {
  isLoadingCharacters.value = true
  try {
    characters.value = await fetchCharacters(token.value as string)
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingCharacters.value = false
  }
}

async function handleCreate(payload: { name: string; race: string; characterClass: string }) {
  isCreating.value = true
  try {
    // race / characterClass ne sont pas encore envoyés : newCharacter() côté service
    // n'accepte que le nom pour l'instant.
    const character = await newCharacter(payload.name, token.value as string)
    characters.value.push(character)
    isNewCharacterOpen.value = false
  } catch (e) {
    newCharacterModalRef.value?.setError('Impossible de créer la fiche')
    console.error(e)
  } finally {
    isCreating.value = false
  }
}

function openCharacter(character: ICharacter) {}
function editCharacter(character: ICharacter) {
  router.push({ name: 'edit-character', params: { id: character.id } })
}

onMounted(loadCharacters)
</script>
