<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Tab = 'login' | 'admin' | 'register'

const activeTab = ref<Tab>('login')
const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const { login } = useAuth()

const endpoints: Record<Tab, string> = {
  login: `${import.meta.env.VITE_API_URL}/auth/login`,
  admin: `${import.meta.env.VITE_API_URL}/auth/admin/login`,
  register: `${import.meta.env.VITE_API_URL}/auth/register`,
}

const labels: Record<Tab, string> = {
  login: 'Connexion',
  admin: 'Admin',
  register: 'Inscription',
}

function switchTab(tab: string | number) {
  activeTab.value = tab as Tab
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
    login(data.access_token, data.username, data.role, data.id)
    router.push('/')
  } catch (e) {
    error.value = (e as Error).message
  }
}
</script>

<template>
  <div class="min-h-screen bg-ink flex items-center justify-center p-6">
    <div class="w-full max-w-sm bg-parchment border border-gold/40 p-8">
      <h1 class="font-display text-3xl text-ink text-center mb-6">Registre des Aventuriers</h1>

      <Tabs :model-value="activeTab" @update:model-value="switchTab" class="mb-6">
        <TabsList
          class="grid grid-cols-3 w-full bg-transparent border-b border-ink/20 rounded-none p-0"
        >
          <TabsTrigger
            v-for="tab in ['login', 'admin', 'register'] as Tab[]"
            :key="tab"
            :value="tab"
            class="font-body rounded-none border-b-2 border-transparent data-[state=active]:border-seal data-[state=active]:text-seal data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {{ labels[tab] }}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-1.5">
          <Label for="username" class="font-body text-ink/80">Nom d'utilisateur</Label>
          <Input
            id="username"
            v-model="username"
            required
            class="rounded-none border-ink/30 bg-white/40 focus-visible:ring-seal"
          />
        </div>

        <div v-if="activeTab === 'admin'" class="flex flex-col gap-1.5">
          <Label for="password" class="font-body text-ink/80">Mot de passe</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            required
            class="rounded-none border-ink/30 bg-white/40 focus-visible:ring-seal"
          />
        </div>

        <p v-if="error" class="font-body text-sm text-seal">{{ error }}</p>

        <Button
          type="submit"
          class="mt-2 rounded-none bg-seal hover:bg-seal/90 text-parchment font-body tracking-wide"
        >
          {{ activeTab === 'register' ? "S'inscrire" : 'Se connecter' }}
        </Button>
      </form>
    </div>
  </div>
</template>
