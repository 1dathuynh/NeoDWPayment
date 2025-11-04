'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Zap, Wifi, Lock, Rocket, Trophy } from 'lucide-react'
import { useSession } from 'next-auth/react'
const UpgradePage = () => {
  const { data: session, status } = useSession()
  const isVip = session?.user?.isVip
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">Loading your membership...</div>
    )
  }
  if (isVip) {
    return (
      <div className="min-h-screen flex items-center max-w-[75%] rounded-md mx-auto justify-center bg-slate-900">
        <div className="max-w-xl text-center p-8 md:p-12 rounded-xl border border-teal-500/50 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl shadow-teal-500/10">
          <Trophy className="w-16 h-16 mx-auto text-teal-400 mb-6 animate-pulse" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">VIP</span>!
          </h2>
          <p className="text-xl text-slate-300 mb-6">
            Your account is now activated with unlimited access to all P2P sharing features.
          </p>
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4 mb-8">
            <p className="text-sm text-teal-300">
              <strong className="text-white">Account:</strong> {session.user?.email || 'N/A'}
            </p>
            <p className="text-sm text-teal-300 mt-1">
              <strong className="text-white">Plan:</strong> VIP Unlimited (Active)
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold px-8 py-3"
            onClick={() => (window.location.href = '/')} // Chuyển về trang chủ
          >
            Go to P2P Dashboard
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen max-w-[75%] rounded-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
          <span className="text-teal-400 text-sm font-medium">Unlock Advanced Features</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Upgrade to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">VIP</span>
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Experience peer-to-peer file sharing without limits. Share files directly with others at lightning-fast
          speeds.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Free Plan */}
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Free Plan</CardTitle>
              <CardDescription className="text-slate-400">Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-3xl font-bold text-white">
                  $0<span className="text-lg text-slate-400">/month</span>
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Up to 100MB file size</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Basic file sharing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">7-day share expiry</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Password protection</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full text-slate-300 border-slate-600 hover:bg-slate-700 bg-transparent"
              >
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* VIP Plan */}
          <Card className="border-teal-500/50 bg-gradient-to-br from-teal-900/20 to-cyan-900/20 backdrop-blur relative overflow-hidden">
            <div className="absolute top-4 right-4 inline-block px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/50">
              <span className="text-teal-300 text-xs font-bold">RECOMMENDED</span>
            </div>
            <CardHeader>
              <CardTitle className="text-white">VIP Plan</CardTitle>
              <CardDescription className="text-teal-200/70">Unlock P2P file sharing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-3xl font-bold text-white">
                  $9.99<span className="text-lg text-slate-400">/month</span>
                </p>
                <p className="text-sm text-teal-300 mt-1">Billed monthly, cancel anytime</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">Unlimited file size</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">
                    <strong>P2P file sharing</strong> - Direct peer connections
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">30-day share expiry</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">Custom branding</span>
                </li>
              </ul>
              <Button
                onClick={async () => {
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
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Upgrade to VIP
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">What You Get With VIP</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* P2P Sharing */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-500/10 rounded-lg">
                  <Wifi className="w-6 h-6 text-teal-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Direct P2P Sharing</h4>
              </div>
              <p className="text-slate-300">
                Share files peer-to-peer without going through our servers. Experience faster speeds and complete
                privacy.
              </p>
            </div>

            {/* Unlimited Size */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-teal-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Unlimited File Size</h4>
              </div>
              <p className="text-slate-300">
                Share files of any size. No limitations on storage or file dimensions. Perfect for large projects and
                backups.
              </p>
            </div>

            {/* Advanced Security */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-500/10 rounded-lg">
                  <Lock className="w-6 h-6 text-teal-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Advanced Security</h4>
              </div>
              <p className="text-slate-300">
                End-to-end encryption, advanced access controls, and detailed analytics to keep your data secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Upgrade?</h3>
        <p className="text-slate-300 mb-8">Join P2P file sharing</p>
        <div className="flex gap-4 justify-center">
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-6 text-lg">
            <Rocket className="w-5 h-5 mr-2" />
            Upgrade Now
          </Button>
          <Button
            variant="outline"
            className="text-white border-slate-600 hover:bg-slate-700 px-8 py-6 text-lg bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UpgradePage
