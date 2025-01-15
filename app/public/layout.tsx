// app/public/layout.tsx

import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        {children} {/* Render the public page content */}
      </body>
    </html>
  )
}
