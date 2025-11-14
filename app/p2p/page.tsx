'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, File } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { usePeerConnection } from '@/hooks/use-peer-connection'
import { ConnectionPanel } from '@/components/connection-panel'
import { FileTransferArea } from '@/components/file-transfer-area'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

export default function P2PFileTransfer() {
  const [selectedPeer, setSelectedPeer] = useState<string>('')
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      window.location.reload()
    } else if (!session.user.isVip) {
      toast.warning('⚠️ Tính năng này chỉ dành cho tài khoản VIP!')
      setTimeout(() => {
        router.push('/upgrade')
      }, 2000)
    }
  }, [session, status])

  if (!session?.user?.isVip) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-10">
        {/* 1. Thêm Spinner */}
        <Spinner className="w-6 h-6 mb-2 text-blue-500" />

        {/* 2. Thông báo đang kiểm tra */}
        <div className="text-gray-600">Check VIP access ...</div>
      </div>
    )
  }

  const {
    isConnected,
    myPeerId,
    connectedPeers,
    connectionStatus,
    files,
    isConnecting,
    connect,
    disconnect,
    connectToPeer,
    sendFiles,
    removeFile,
  } = usePeerConnection()

  const handleFilesSelected = (fileList: File[]) => {
    if (!selectedPeer) {
      alert('Please select a peer to send files to')
      return
    }
    sendFiles(fileList, selectedPeer)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Panel */}
          <ConnectionPanel
            isConnected={isConnected}
            myPeerId={myPeerId}
            connectedPeers={connectedPeers}
            connectionStatus={connectionStatus}
            isConnecting={isConnecting}
            selectedPeer={selectedPeer}
            onConnect={connect}
            onDisconnect={disconnect}
            onConnectToPeer={connectToPeer}
            onSelectPeer={setSelectedPeer}
          />

          {/* File Transfer Area */}
          <FileTransferArea
            files={files}
            connectedPeers={connectedPeers}
            selectedPeer={selectedPeer}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={removeFile}
          />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="p-4 text-center">
            <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {files.filter((f) => f.status === 'completed' && f.type === 'upload').length}
            </p>
            <p className="">Files Sent</p>
          </Card>
          <Card className="p-4 text-center">
            <Download className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold ">
              {files.filter((f) => f.status === 'completed' && f.type === 'download').length}
            </p>
            <p className="">Files Received</p>
          </Card>
          <Card className="p-4 text-center">
            <File className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold ">
              {(files.reduce((acc, f) => acc + (f.status === 'completed' ? f.size : 0), 0) / 1024 / 1024).toFixed(1)}
            </p>
            <p className="">MB Transferred</p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
