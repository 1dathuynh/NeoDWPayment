'use server'

import { prisma } from '@/lib/prisma' // hoặc đường dẫn tới Prisma client của bạn

export async function upgradeVip(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { isVip: true },
  })
  return { success: true }
}
