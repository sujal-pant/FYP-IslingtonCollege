import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ApplicationAuthProvider } from '@/components/Authentication/Application-Auth-Provider'
import { Toaster } from 'sonner'
import { ModalProvider } from '@/components/modals/model-provider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SketchSphere',
  description: 'SketchSphere is a collaborative whiteboard tool for teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApplicationAuthProvider><Toaster/>
        <ModalProvider/>
        {children}</ApplicationAuthProvider></body>
    </html>
  )
}
