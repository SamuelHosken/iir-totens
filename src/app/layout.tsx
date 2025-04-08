import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/global.css'
import { ThemeRegistry } from '@/components/ThemeRegistry'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Totens',
  description: 'Sistema de gestão de totens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
} 