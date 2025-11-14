import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const key2 = 'uUfsWgfLkRLzq6W2uNXTCxrfxs51auny'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📩 ZaloPay IPN nhận được:', body)

    const { data, mac } = body

    // Kiểm tra MAC với HMAC-SHA256
    // const macCheck = crypto.createHmac('sha256', key2).update(data).digest('hex')
    // if (macCheck !== mac) {
    //   console.warn('❌ Sai MAC')
    //   return new Response(
    //     JSON.stringify({
    //       returncode: -1,
    //       returnmessage: 'mac not equal',
    //     }),
    //   )
    // }

    const dataObj = JSON.parse(data)
    const app_trans_id = dataObj.apptransid
    const embedData = dataObj.embeddata ? JSON.parse(dataObj.embeddata) : {}
    const userId = embedData.userId

    if (!userId) {
      console.warn('❌ Không tìm thấy userId trong embeddata')
      return new Response(
        JSON.stringify({
          returncode: -1,
          returnmessage: 'userId not found in embeddata',
        }),
      )
    }

    // Cập nhật trạng thái transaction, chỉ nếu chưa SUCCESS (idempotent)
    await prisma.transaction.updateMany({
      where: { orderId: app_trans_id, status: { not: 'SUCCESS' } },
      data: { status: 'SUCCESS' },
    })

    // Nâng VIP user
    await prisma.user.update({
      where: { id: userId },
      data: { isVip: true },
    })

    console.log(`🎉 User ${userId} đã được nâng VIP (ZaloPay)`)

    return new Response(
      JSON.stringify({
        returncode: 1,
        returnmessage: 'success',
      }),
    )
  } catch (err) {
    console.error('❌ Lỗi xử lý IPN:', err)
    return new Response(
      JSON.stringify({
        returncode: 0,
        returnmessage: 'update error',
      }),
    )
  }
}

export async function GET() {
  return new Response('ZaloPay IPN OK')
}
