'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from './ui/button'
import { Badge } from '@/components/ui/badge'
import { signOut, useSession } from 'next-auth/react'

export default function UserAvatar() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Link href="/auth/login">
        <Button variant="fancy" className="bg-black text-white dark:bg-white dark:text-black">
          Login
        </Button>
      </Link>
    )
  }

  const user = session.user

  return (
    <div className="flex items-center gap-3">
      <div className="flex border rounded-2xl px-3 py-2 items-center gap-2">
        <div className="flex flex-col">
          <p className="text-xs text-neutral-600">Login as</p>
          <p className="text-xs">{user?.email}</p>
        </div>

        <div className="relative flex items-center">
          <Avatar className="h-8 w-8 mx-2">
            <AvatarImage src={user?.image || '/images/header-design.png'} alt="User avatar" />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-500 text-white text-sm">
              {user?.name?.[0] ?? 'U'}
            </AvatarFallback>
          </Avatar>

          {user?.isVip && (
            <Badge className="bg-gradient-to-r absolute -top-3 -right-6 from-yellow-400 to-amber-500 text-black shadow-md text-[10px] font-bold">
              VIP
            </Badge>
          )}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
        Logout
      </Button>
    </div>
  )
}
