'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft, Zap, Shield, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

const PaymentSuccessPage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const handleDashboard = async () => {
    const res = await fetch('/api/upgrade-vip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session?.user?.id }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success('🎉 VIP updated!')
      router.push('/')
      router.refresh()
    } else {
      alert('❌ Failed to update VIP')
    }
  }
  return (
    <div className="min-h-screen max-w-[75%] rounded-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl w-full">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-2xl"></div>
              <CheckCircle className="w-24 h-24 text-teal-400 relative" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Payment Successful!</h1>
            <p className="text-xl text-slate-300 mb-2">Thank you for upgrading to VIP</p>
            <p className="text-slate-400">Your account has been upgraded and you now have access to premium features</p>
          </div>

          {/* Order Details Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8 backdrop-blur">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <span className="text-slate-400">Transaction ID:</span>
                {/* <span className="text-white font-semibold">TXN-{Date.now()}</span> */}
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="text-teal-400 font-semibold">$1.90</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-400 font-semibold">Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <p className="text-slate-400 mb-4 text-sm">Your VIP membership includes:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-teal-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">Premium Speed</span>
                </div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-semibold">Priority Support</span>
                </div>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-teal-400 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-semibold">Exclusive Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              onClick={handleDashboard}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-6 text-lg"
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Support Message */}
          <p className="text-slate-400 text-sm mt-8 mb-5">
            Need help? Contact our support team at{' '}
            <span className="text-teal-400 hover:text-cyan-400 cursor-pointer">support@example.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
