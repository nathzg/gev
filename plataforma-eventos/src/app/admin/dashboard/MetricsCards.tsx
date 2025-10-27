import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, CheckCircle, Clock, Users2, MessageSquare } from 'lucide-react'

interface MetricsCardsProps {
  totalUsers: number
  approvedUsers: number
  pendingUsers: number
  totalEvents: number
  finishedEvents: number
  activeEvents: number
  totalAttendees: number
  totalQuestions: number
}

export function MetricsCards({
  totalUsers,
  approvedUsers,
  pendingUsers,
  totalEvents,
  finishedEvents,
  activeEvents,
  totalAttendees,
  totalQuestions
}: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Usuarios Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {approvedUsers} aprobados, {pendingUsers} pendientes
          </p>
        </CardContent>
      </Card>

      {/* Eventos Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEvents}</div>
          <p className="text-xs text-muted-foreground">
            {activeEvents} activos, {finishedEvents} finalizados
          </p>
        </CardContent>
      </Card>

      {/* Asistentes Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Asistentes</CardTitle>
          <Users2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAttendees.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Convocados en todos los eventos
          </p>
        </CardContent>
      </Card>

      {/* Preguntas Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Preguntas Públicas</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuestions}</div>
          <p className="text-xs text-muted-foreground">
            Preguntas enviadas por el público
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
