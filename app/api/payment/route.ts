import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  const body = await req.json()
  const { userId } = body
  

  var accessKey = 'F8BBA842ECF85'
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
  var orderInfo = 'pay with MoMo'
  var partnerCode = 'MOMO'
  var redirectUrl = 'http://localhost:3000/'
  var ipnUrl = 'https://a91a5c42c49f.ngrok-free.app/api/momo-ipn'
  var requestType = 'payWithMethod'
  var amount = '50000'
  var orderId = partnerCode + new Date().getTime()
  var requestId = orderId
  var extraData = userId
  var paymentCode =
    'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA=='
  var orderGroupId = ''
  var autoCapture = true
  var lang = 'vi'

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType
  //puts raw signature
  // console.log('--------------------RAW SIGNATURE----------------')
  // console.log(rawSignature)
  //signature
  var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
  // console.log('--------------------SIGNATURE----------------')
  // console.log(signature)

  await prisma.transaction.create({
    data: {
      userId,
      amount: Number(amount),
      orderId,
      description: orderInfo,
    },
  })

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  })
  const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  })
  const data = await response.json()
  // console.log('MoMo Response:', data)

  return NextResponse.json({ message: 'Payment created', data })
}
export async function GET(req: Request) {
  return NextResponse.json({ message: 'Hello' })
}
