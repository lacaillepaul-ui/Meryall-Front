<template>
  <div class="min-h-screen bg-ink p-8">
    <p v-if="isLoading" class="font-body text-parchment/70">Chargement...</p>

    <template v-else-if="localCharacter">
      <div class="max-w-2xl mx-auto bg-parchment border border-ink/20 p-8">
        <h1 class="font-display text-3xl text-ink mb-6">{{ localCharacter.name }}</h1>

        <Tabs v-model="activeTab">
          <TabsList
            class="grid grid-cols-2 w-full bg-transparent border-b border-ink/20 rounded-none p-0 mb-6"
          >
            <TabsTrigger
              v-for="tab in tabs"
              :key="tab.id"
              :value="tab.id"
              class="font-body rounded-none border-b-2 border-transparent data-[state=active]:border-seal data-[state=active]:text-seal data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {{ tab.label }}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identite" class="flex flex-col gap-1.5 max-w-sm">
            <Label for="character-name" class="text-ink/80">Nom</Label>
            <Input
              id="character-name"
              v-model="localCharacter.name"
              placeholder="Nom du personnage"
              class="rounded-none border-ink/30 bg-white/40 focus-visible:ring-seal"
            />
          </TabsContent>

          <TabsContent value="autre">
            <p class="font-body text-ink/60">Contenu à venir...</p>
          </TabsContent>
        </Tabs>

        <p v-if="errorMessage" class="font-body text-sm text-seal mt-4">{{ errorMessage }}</p>

        <div class="mt-6">
          <Button
            :disabled="isSaving"
            class="rounded-none bg-seal hover:bg-seal/90 text-parchment"
            @click="handleSave"
          >
            {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
          </Button>
        </div>
      </div>
    </template>

    <p v-else class="font-body text-seal">Personnage introuvable.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { fetchCharacter, saveCharacter } from '@/services/characterService'
import type { ICharacter } from '@/types/character'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { token } = useAuth()

const localCharacter = ref<ICharacter | null>(null)
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

const tabs = [
  { id: 'identite', label: 'Identité' },
  { id: 'autre', label: 'Autre' },
] as const

const activeTab = ref<(typeof tabs)[number]['id']>('identite')

async function loadCharacter() {
  isLoading.value = true
  try {
    localCharacter.value = await fetchCharacter(props.id, token.value as string)
  } catch (e) {
    console.error(e)
    localCharacter.value = null
  } finally {
    isLoading.value = false
  }
}

async function handleSave() {
  if (!localCharacter.value) return

  isSaving.value = true
  errorMessage.value = ''

  try {
    await saveCharacter(localCharacter.value.id, localCharacter.value.name, token.value as string)
    router.push({ name: 'fiches' })
  } catch (e) {
    errorMessage.value = 'Impossible d’enregistrer le personnage'
    console.error(e)
  } finally {
    isSaving.value = false
  }
}

onMounted(loadCharacter)
</script>
