// pages/api/paypal-payment.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()
  console.log('Received userId in POST request:', userId)
  // 1. Tạo order trên PayPal
  const clientId = 'Aa8mghJcaFi1GfOn6_3v3VWUXEszSL4M4PvO0fG6ewcWzJrMFZ9ZPIZlAUH_n-KucR2LSx8tNvSRQ6w1'
  const secret = 'EMtPJ16HF5ZN7RD_fo1wjg37cgeW9Dcro69JvOD33cyVeH7qVuXr5WPkarvWIsMPVfpS474sHvHnKtBf'
  const baseUrl = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'

  // Lấy access token
  const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(clientId + ':' + secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  console.log('Token status:', tokenRes.status)
  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token

  const amount = '1.90' // số tiền

  // Tạo order
  const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: userId, // dùng làm liên kết transaction
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
      application_context: {
        return_url: `http://localhost:3000/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      },
    }),
  })

  const orderData = await orderRes.json()

  // 2. Lưu transaction vào DB
  await prisma.transaction.create({
    data: {
      userId,
      amount: Number(amount),
      orderId: orderData.id, // PayPal orderId
      description: `PayPal payment for user ${userId}`,
      status: 'PENDING',
    },
  })

  return NextResponse.json({ data: orderData })
}
export async function GET() {
  return NextResponse.json({ message: 'Hello' })
}
