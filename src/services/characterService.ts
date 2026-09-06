import type { ICharacter } from '@/types/character'

const apiUrl = import.meta.env.VITE_API_URL

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function fetchCharacters(token: string): Promise<ICharacter[]> {
  const response = await fetch(`${apiUrl}/characters`, {
    headers: authHeaders(token),
  })
  if (!response.ok) throw new Error('Erreur lors de la récupération des fiches')
  return response.json()
}

export async function fetchCharacter(id: string, token: string): Promise<ICharacter> {
  const response = await fetch(`${apiUrl}/characters/${id}`, {
    headers: authHeaders(token),
  })
  if (!response.ok) throw new Error('Personnage introuvable')
  return response.json()
}

export async function newCharacter(name: string, token: string): Promise<ICharacter> {
  const response = await fetch(`${apiUrl}/characters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify({ name }),
  })
  if (!response.ok) throw new Error('Erreur lors de la création de la fiche')
  return response.json()
}

export async function saveCharacter(id: number, name: string, token: string): Promise<ICharacter> {
  const response = await fetch(`${apiUrl}/characters/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify({ name }),
  })
  if (!response.ok) throw new Error('Erreur lors de la sauvegarde')
  return response.json()
}
