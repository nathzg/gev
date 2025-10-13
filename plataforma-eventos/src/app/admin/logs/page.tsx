import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogsTable } from './LogsTable'

// Forzar que la página sea dinámica
export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  // Verificar que el usuario es admin
  const session = await requireAuth()
  if (session.rol !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Solo los administradores pueden acceder a esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Obtener todos los logs
  const logs = await db.getLogs()
  
  // Ordenar por timestamp descendente (más recientes primero)
  const sortedLogs = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Estadísticas de logs
  const totalLogs = logs.length
  const logsByAction = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const uniqueActors = new Set(logs.map(log => log.actor)).size

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Logs de Auditoría</h1>
          <p className="mt-2 text-gray-600">
            Registro de todas las acciones realizadas en la plataforma
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total de Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalLogs}</div>
              <p className="text-sm text-gray-500">Acciones registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usuarios Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{uniqueActors}</div>
              <p className="text-sm text-gray-500">Usuarios que han realizado acciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Acción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{Object.keys(logsByAction).length}</div>
              <p className="text-sm text-gray-500">Diferentes tipos de acciones</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones más comunes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Acciones Más Comunes</CardTitle>
            <CardDescription>
              Distribución de acciones por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(logsByAction)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([action, count]) => (
                  <Badge key={action} variant="secondary" className="text-sm">
                    {action}: {count}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabla de logs */}
        <Card>
          <CardHeader>
            <CardTitle>Registro Completo de Logs</CardTitle>
            <CardDescription>
              Lista de todas las acciones realizadas en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogsTable logs={sortedLogs} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
