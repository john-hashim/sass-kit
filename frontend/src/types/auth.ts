export type Theme = 'light' | 'dark' | 'system'

export interface User {
  id: string
  email: string
  name: string
  theme: Theme
}
