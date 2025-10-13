'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Settings, BarChart3, FileText, LogOut, Calendar, Users } from 'lucide-react'

interface SessionUser {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: string
  aprobado: boolean
}

export default function Navigation() {
  const [session, setSession] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            setSession(data.user)
          }
        }
      } catch (error) {
        console.error('Error verificando sesión:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleLogout = async () => {
    try {
      // Hacer logout y redirigir
      window.location.href = '/api/auth/logout'
    } catch (error) {
      console.error('Error cerrando sesión:', error)
      // Fallback: redirigir manualmente
      router.push('/login')
    }
  }

  // No mostrar navegación en páginas de login/register
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/evento/')) {
    return null
  }

  if (loading) {
    return (
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Título */}
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">Plataforma de Eventos</h1>
          </div>

          {/* Navegación */}
          <div className="flex items-center space-x-4">
            {/* Botón de Eventos */}
            <Button
              variant={pathname === '/eventos' ? 'default' : 'ghost'}
              onClick={() => router.push('/eventos')}
              className="flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Eventos
            </Button>

            {/* Botón de Nuevo Evento */}
            <Button
              variant={pathname === '/eventos/nuevo' ? 'default' : 'ghost'}
              onClick={() => router.push('/eventos/nuevo')}
              className="flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>

            {/* Botones de Admin */}
            {session.rol === 'admin' && (
              <>
                {/* Botón de Dashboard */}
                <Button
                  variant={pathname === '/admin/dashboard' ? 'default' : 'ghost'}
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex items-center"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>

                {/* Botón de Logs */}
                <Button
                  variant={pathname === '/admin/logs' ? 'default' : 'ghost'}
                  onClick={() => router.push('/admin/logs')}
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Logs
                </Button>

                {/* Botón de Usuarios */}
                <Button
                  variant={pathname === '/admin/usuarios' ? 'default' : 'ghost'}
                  onClick={() => router.push('/admin/usuarios')}
                  className="flex items-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Usuarios
                </Button>
              </>
            )}

            {/* Información del usuario */}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{session.nombre} {session.apellido}</span>
                {session.rol === 'admin' && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
