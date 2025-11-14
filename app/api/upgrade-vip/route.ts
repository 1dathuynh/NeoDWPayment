// pages/api/upgrade-vip.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()
  console.log(userId)
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isVip: true },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
