import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricsCards } from './MetricsCards'
import { EventsChart } from './EventsChart'
import { UsersChart } from './UsersChart'
import { SectorsChart } from './SectorsChart'

// Forzar que la página sea dinámica
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
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

  // Obtener datos para métricas
  const [users, events, preguntas, logs] = await Promise.all([
    db.getUsers(),
    db.getEvents(),
    db.getPreguntas(),
    db.getLogs()
  ])

  // Calcular métricas
  const totalUsers = users.length
  const approvedUsers = users.filter(u => u.aprobado).length
  const pendingUsers = users.filter(u => !u.aprobado).length

  const totalEvents = events.length
  const finishedEvents = events.filter(e => e.finalizado).length
  const activeEvents = events.filter(e => !e.finalizado).length

  const totalAttendees = events.reduce((sum, event) => sum + event.numeroConvocados, 0)

  // Métricas por sector
  const eventsBySector = events.reduce((acc, event) => {
    acc[event.sector] = (acc[event.sector] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Métricas por categoría
  const eventsByCategory = events.reduce((acc, event) => {
    acc[event.categoria] = (acc[event.categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Asistentes por sector
  const attendeesBySector = events.reduce((acc, event) => {
    acc[event.sector] = (acc[event.sector] || 0) + event.numeroConvocados
    return acc
  }, {} as Record<string, number>)

  // Eventos por mes (últimos 6 meses)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const eventsByMonth = events
    .filter(event => new Date(event.createdAt) >= sixMonthsAgo)
    .reduce((acc, event) => {
      const month = new Date(event.createdAt).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short' 
      })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  // Usuarios por mes (últimos 6 meses)
  const usersByMonth = users
    .filter(user => new Date(user.createdAt) >= sixMonthsAgo)
    .reduce((acc, user) => {
      const month = new Date(user.createdAt).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short' 
      })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const totalQuestions = preguntas.length

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Métricas</h1>
          <p className="mt-2 text-gray-600">
            Resumen general de la actividad en la plataforma
          </p>
        </div>

        {/* Tarjetas de métricas principales */}
        <MetricsCards 
          totalUsers={totalUsers}
          approvedUsers={approvedUsers}
          pendingUsers={pendingUsers}
          totalEvents={totalEvents}
          finishedEvents={finishedEvents}
          activeEvents={activeEvents}
          totalAttendees={totalAttendees}
          totalQuestions={totalQuestions}
        />

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Eventos por sector */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos por Sector</CardTitle>
              <CardDescription>
                Distribución de eventos según el sector
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectorsChart data={eventsBySector} />
            </CardContent>
          </Card>

          {/* Eventos por categoría */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos por Categoría</CardTitle>
              <CardDescription>
                Distribución de eventos según la categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectorsChart data={eventsByCategory} />
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de tendencias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Eventos por mes */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos por Mes</CardTitle>
              <CardDescription>
                Tendencia de creación de eventos (últimos 6 meses)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsChart data={eventsByMonth} />
            </CardContent>
          </Card>

          {/* Usuarios por mes */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios por Mes</CardTitle>
              <CardDescription>
                Tendencia de registro de usuarios (últimos 6 meses)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersChart data={usersByMonth} />
            </CardContent>
          </Card>
        </div>

        {/* Asistentes por sector */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Asistentes por Sector</CardTitle>
            <CardDescription>
              Total de asistentes convocados por sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SectorsChart data={attendeesBySector} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
