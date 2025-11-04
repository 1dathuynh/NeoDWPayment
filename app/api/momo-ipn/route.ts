import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('📩 MoMo IPN:', body)
  const { resultCode, orderId, extraData: userId } = body
  try {
    if (resultCode === 0) {
      // ✅ Giao dịch thành công
      await prisma.transaction.update({
        where: { orderId },
        data: { status: 'SUCCESS' },
      })
      await prisma.user.update({
        where: { id: userId },
        data: { isVip: true },
      })
      console.log(`✅ User ${userId} đã được nâng cấp VIP`)
    } else {
      // ❌ Thanh toán thất bại
      await prisma.transaction.update({
        where: { orderId },
        data: { status: 'FAILED' },
      })
    }
  } catch (error) {
    console.error('❌ Lỗi khi xử lý IPN:', error)
  }

  return new Response(null, { status: 204 })
}

export async function GET() {
  return new Response('MoMo IPN OK')
}
