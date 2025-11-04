export const dynamic = 'force-dynamic'

import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { PassThrough } from 'stream'
import { auth } from '@/auth'

const prisma = new PrismaClient()

type ParamsContext = { params: Promise<{ token: string }> }

export async function GET(req: NextRequest, context: ParamsContext) {
  const token = (await context.params).token
  const fileId = req.nextUrl.searchParams.get('fileId')
  const password = req.nextUrl.searchParams.get('password') || ''

  const session = await auth()
  const user_id = session?.user?.id ?? '0'

  const shareLink = await prisma.shareLink.findUnique({
    where: { id: token },
    include: { files: true },
  })

  if (!shareLink) {
    return NextResponse.json({ error: 'Link không tồn tại' }, { status: 404 })
  }

  if (shareLink.expiredAt && new Date() > shareLink.expiredAt) {
    return NextResponse.json({ error: 'Link đã hết hạn' }, { status: 410 })
  }

  if (shareLink.passwordHash) {
    const valid = await bcrypt.compare(password, shareLink.passwordHash)
    if (!valid && user_id !== shareLink.creatorId) {
      return NextResponse.json({ error: 'Sai mật khẩu hoặc chưa nhập' }, { status: 401 })
    }
  }

  if (shareLink.maxDownloads !== null && shareLink.downloadsCount >= shareLink.maxDownloads) {
    return NextResponse.json({ error: 'Link đã đạt giới hạn tải' }, { status: 403 })
  }

  const files = shareLink.files
  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'Không có file' }, { status: 404 })
  }

  // Handle single fileId download
  const downloadFile = async (file: any) => {
    const filePath = path.join(process.cwd(), 'uploads', token, file.filename)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File vật lý không tồn tại' }, { status: 404 })
    }

    const buffer = fs.readFileSync(filePath)

    await prisma.shareLink.update({
      where: { id: shareLink.id },
      data: { downloadsCount: { increment: 1 } },
    })

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': file.mime,
        'Content-Disposition': `attachment; filename="${file.filename}"`,
      },
    })
  }

  if (fileId) {
    const file = files.find((f) => f.id === fileId)
    if (!file) {
      return NextResponse.json({ error: 'File không tồn tại' }, { status: 404 })
    }
    return await downloadFile(file)
  }

  if (files.length === 1) {
    return await downloadFile(files[0])
  }

  // Multiple files -> zip them
  const archive = archiver('zip', { zlib: { level: 9 } })
  const passThrough = new PassThrough()

  const zipStream = new ReadableStream({
    start(controller) {
      passThrough.on('data', (chunk) => controller.enqueue(chunk))
      passThrough.on('end', () => controller.close())
      passThrough.on('error', (err) => controller.error(err))
    },
  })

  archive.pipe(passThrough)

  for (const file of files) {
    const filePath = path.join(process.cwd(), 'uploads', token, file.filename)
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: file.filename })
    }
  }

  archive.finalize()

  await prisma.shareLink.update({
    where: { id: shareLink.id },
    data: { downloadsCount: { increment: 1 } },
  })

  return new NextResponse(zipStream, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${shareLink.title || 'files'}.zip"`,
    },
  })
}
