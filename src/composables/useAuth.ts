import { ref } from 'vue'

const token = ref<string | null>(localStorage.getItem('token'))
const username = ref<string | null>(localStorage.getItem('username'))
const role = ref<string | null>(localStorage.getItem('role'))
const id = ref<number | null>(
  localStorage.getItem('id') ? parseInt(localStorage.getItem('id') as string) : null,
)

function setToken(value: string) {
  token.value = value
  localStorage.setItem('token', value)
}

function setUsername(value: string) {
  username.value = value
  localStorage.setItem('username', value)
}

function setRole(value: string) {
  role.value = value
  localStorage.setItem('role', value)
}

function setId(value: number) {
  id.value = value
  localStorage.setItem('id', value.toString())
}

export function useAuth() {
  function login(token: string, username: string, role: string, id: number) {
    setToken(token)
    setUsername(username)
    setRole(role)
    setId(id)
  }

  function logout() {
    username.value = null
    token.value = null
    role.value = null
    id.value = null
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('id')
  }

  return { token, username, role, id, login, logout }
}
