import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    id: string
    role: string
    isVip?: boolean
  }

  interface User {
    id: string
    role: string
    isVip?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    isVip?: boolean
  }
}
