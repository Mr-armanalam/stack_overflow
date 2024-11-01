import {ClerkProvider} from '@clerk/nextjs'
import './globals.css'
import React from 'react'


export const metadata = {
  title: 'Next.js 13 with clerk',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}