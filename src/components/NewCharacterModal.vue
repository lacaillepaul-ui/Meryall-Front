<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="bg-parchment border-ink/20 rounded-none font-body sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="font-display text-2xl text-ink">Nouveau personnage</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-4 py-2">
        <div class="flex flex-col gap-1.5">
          <Label for="nom-character" class="text-ink/80">Nom du personnage</Label>
          <Input
            id="nom-character"
            v-model="name"
            class="rounded-none border-ink/30 bg-white/40 focus-visible:ring-seal"
            @keyup.enter="handleCreate"
          />
        </div>

        <div class="flex gap-4">
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <Label for="race-character" class="text-ink/80">Race</Label>
            <Input
              id="race-character"
              v-model="race"
              class="rounded-none border-ink/30 bg-white/40 focus-visible:ring-seal"
              @keyup.enter="handleCreate"
            />
          </div>

          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <Label for="class-character" class="text-ink/80">Classe/Rôle</Label>
            <Input
              id="class-character"
              v-model="characterClass"
              class="rounded-none border-ink/30 bg-white/40 focus-visible:ring-seal"
              @keyup.enter="handleCreate"
            />
          </div>
        </div>

        <p v-if="errorMessage" class="text-sm text-seal">{{ errorMessage }}</p>
      </div>

      <DialogFooter>
        <Button variant="outline" class="rounded-none border-ink/30 text-ink" @click="close">
          Annuler
        </Button>
        <Button
          :disabled="isLoading"
          class="rounded-none bg-seal hover:bg-seal/90 text-parchment"
          @click="handleCreate"
        >
          {{ isLoading ? 'Création...' : 'Accepter' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const isOpen = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  create: [payload: { name: string; race: string; characterClass: string }]
}>()

defineProps<{
  isLoading?: boolean
}>()

const name = ref('')
const race = ref('')
const characterClass = ref('')
const errorMessage = ref('')

watch(isOpen, (open) => {
  if (open) {
    name.value = ''
    race.value = ''
    characterClass.value = ''
    errorMessage.value = ''
  }
})

function close() {
  isOpen.value = false
}

function handleCreate() {
  if (!name.value.trim()) {
    errorMessage.value = 'Le nom est requis'
    return
  }
  errorMessage.value = ''
  emit('create', {
    name: name.value.trim(),
    race: race.value.trim(),
    characterClass: characterClass.value.trim(),
  })
}

defineExpose({
  setError: (msg: string) => {
    errorMessage.value = msg
  },
})
</script>
