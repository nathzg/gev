import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { seedDatabase } from '@/lib/seed'
import Navigation from '@/components/Navigation'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plataforma de Manejo de Eventos',
  description: 'Sistema de gestión de eventos con roles y permisos',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Inicializar datos de ejemplo
  await seedDatabase()
  
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Navigation />
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  )
}
