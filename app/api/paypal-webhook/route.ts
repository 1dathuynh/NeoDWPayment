// pages/api/paypal-webhook.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('📩 PayPal Webhook:', body)

  try {
    const eventType = body.event_type
    const resource = body.resource

    if (eventType === 'CHECKOUT.ORDER.COMPLETED' || eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderId = resource.id
      const userId = resource.purchase_units?.[0]?.reference_id

      // Cập nhật transaction
      await prisma.transaction.updateMany({
        where: { orderId, status: 'PENDING' },
        data: { status: 'SUCCESS' },
      })

      // Nâng VIP user
      await prisma.user.update({
        where: { id: userId },
        data: { isVip: true },
      })

      console.log(`✅ User ${userId} đã được nâng VIP (PayPal)`)
    }
  } catch (err) {
    console.error('❌ Lỗi khi xử lý webhook PayPal:', err)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }

  return NextResponse.json({ status: 'success' })
}
