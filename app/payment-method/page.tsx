'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Zap, Shield, CreditCard, Landmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  benefits: string[]
  supported: boolean
}

const PaymentMethodPage = () => {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { data: session, status } = useSession()

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'momo',
      name: 'Momo',
      description: 'Pay with your Momo digital wallet',
      icon: <Zap className="w-8 h-8 text-teal-400" />,
      benefits: ['Fast and instant payment', 'Cashback rewards available', 'Enhanced security'],
      supported: true,
    },
    {
      id: 'paypal',
      name: 'Paypal',
      description: 'Pay with Zalo Pay application',
      icon: <CreditCard className="w-8 h-8 text-cyan-400" />,
      benefits: ['Easy integration', 'Protection', 'Secure'],
      supported: true,
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      description: 'Pay with Zalo Pay application',
      icon: <Landmark className="w-8 h-8 text-cyan-400" />,
      benefits: ['Easy Zalo integration', 'Buyer protection', 'Secure transactions'],
      supported: true,
    },
  ]

  const handlePaymentWithMomo = async () => {
    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session?.user?.id,
      }), // ✅ truyền userId
    })
    const data = await res.json()
    console.log(data)
    window.location.href = data.data.payUrl // chuyển sang MoMo
  }
  const handlePaymentWithPaypal = async () => {
    const res = await fetch('/api/paypal-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session?.user?.id }),
    })
    const data = await res.json()
    const approveLink = data.data.links.find((l: any) => l.rel === 'approve').href
    window.location.href = approveLink
  }
  const handlePaymentWithZalo = async () => {
    const res = await fetch('/api/payment-zalopay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session?.user?.id,
      }),
    })
    const data = await res.json()
    console.log(data)
    window.location.href = data.order_url // chuyển sang ZaloPay
  }
  const handleSelectMethod = async (methodId: string) => {
    setSelectedMethod(methodId)
    // setIsProcessing(true)
    // try {
    //   // Gọi API để xử lý thanh toán
    //   const res = await fetch('/api/payment-gateway', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       paymentMethod: methodId,
    //     }),
    //   })
    //   const data = await res.json()
    //   if (data.success && data.redirectUrl) {
    //     // Redirect đến trang thanh toán
    //     window.location.href = data.redirectUrl
    //   } else {
    //     console.error('Payment initialization failed:', data.error)
    //     setIsProcessing(false)
    //   }
    // } catch (error) {
    //   console.error('Error:', error)
    //   setIsProcessing(false)
    // }
  }

  return (
    <div className="min-h-screen max-w-[75%] rounded-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
          <span className="text-teal-400 text-sm font-medium">Select Payment Method</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Choose Your Payment Gateway</h1>
        <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
          Select the payment method that works best for you to complete your VIP upgrade
        </p>
      </div>

      {/* Payment Methods Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              onClick={() => !isProcessing && handleSelectMethod(method.id)}
              className={`border transition-all cursor-pointer ${
                selectedMethod === method.id
                  ? 'border-teal-500/50 bg-gradient-to-br from-teal-900/20 to-cyan-900/20 shadow-lg shadow-teal-500/20'
                  : 'border-slate-700/50 bg-slate-800/50 hover:border-teal-500/30 hover:shadow-md hover:shadow-teal-500/10'
              } backdrop-blur relative overflow-hidden`}
            >
              {/* Selected Badge */}
              {selectedMethod === method.id && (
                <div className="absolute top-4 right-4 inline-block px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/50">
                  <span className="text-teal-300 text-xs font-bold">✓ SELECTED</span>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-lg">{method.icon}</div>
                </div>
                <CardTitle className="text-white text-2xl">{method.name}</CardTitle>
                <CardDescription className="text-slate-400">{method.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Benefits List */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {method.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <Button
                  onClick={() => {
                    if (selectedMethod == method.id) {
                      if (method.id === 'momo') {
                        handlePaymentWithMomo()
                      } else if (method.id === 'zalopay') {
                        handlePaymentWithZalo()
                      } else if (method.id === 'paypal') {
                        handlePaymentWithPaypal()
                      }
                    } else {
                      handleSelectMethod(method.id)
                    }
                  }}
                  disabled={isProcessing && selectedMethod !== method.id}
                  className={`w-full font-semibold transition-all ${
                    selectedMethod === method.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {isProcessing && selectedMethod === method.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : selectedMethod === method.id ? (
                    'Proceed to Payment'
                  ) : (
                    'Select This Method'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-teal-400" />
                <h4 className="font-semibold text-white">Fast Payments</h4>
              </div>
              <p className="text-slate-400 text-sm">Payment process takes only seconds, completely safe and secure</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-teal-400" />
                <h4 className="font-semibold text-white">Optimal Security</h4>
              </div>
              <p className="text-slate-400 text-sm">All transactions are end-to-end encrypted and fully protected</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-5 h-5 text-teal-400" />
                <h4 className="font-semibold text-white">24/7 Support</h4>
              </div>
              <p className="text-slate-400 text-sm">Having issues? Our support team is ready to help anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">Ready?</h3>
        <p className="text-slate-300 mb-8">Choose your payment method and complete your VIP upgrade today</p>
      </div>
    </div>
  )
}

export default PaymentMethodPage
