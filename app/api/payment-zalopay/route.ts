import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import qs from 'qs'
import { prisma } from '@/lib/prisma'

const config = {
  appid: 554,
  key1: '8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn',
  key2: 'uUfsWgfLkRLzq6W2uNXTCxrfxs51auny',
  endpoint: 'https://sandbox.zalopay.com.vn/v001/tpe/createorder',
}

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  const embed_data = {
    redirecturl: 'http://localhost:3000/payment-success',
    userId,
  }
  const items: any[] = []

  const app_trans_id = `${new Date().toISOString().slice(2, 10).replace(/-/g, '')}_${Date.now()}`

  const order = {
    appid: config.appid,
    apptransid: app_trans_id,
    appuser: userId,
    apptime: Date.now(),
    item: JSON.stringify(items),
    embeddata: JSON.stringify(embed_data),
    amount: 5000,
    description: `Thanh toán ZaloPay cho user ${userId}`,
    bankcode: 'zalopayapp',
    ipnUrl: 'https://a91a5c42c49f.ngrok-free.app/api/zalopay-ipn',
  }

  // Tạo MAC
  const data = `${order.appid}|${order.apptransid}|${order.appuser}|${order.amount}|${order.apptime}|${order.embeddata}|${order.item}`

  const mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex')
  const body = { ...order, mac }

  // Lưu DB
  await prisma.transaction.create({
    data: {
      userId,
      orderId: app_trans_id,
      amount: order.amount,
      description: order.description,
      status: 'PENDING',
    },
  })

  // Gửi request dạng x-www-form-urlencoded
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: qs.stringify(body),
  })

  const result = await response.json()
  console.log('Zalo Response:', result)

  return NextResponse.json({
    message: 'ZaloPay created',
    order_url: result.orderurl,
  })
}

export async function GET() {
  return new Response('Payment ZaloPay OK')
}
