import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar, MapPin, Users, User, CheckCircle, Clock, Edit, Trash2, Flag, Plus, Search, Filter } from 'lucide-react'

export default async function EventosPage() {
  const session = await requireAuth()
  const events = await db.getEvents()
  const users = await db.getUsers()

  const canCreateEvent = session.rol === 'admin' || session.rol === 'colaborador'

  // Función para obtener el nombre del creador
  const getCreatorName = (creatorId: string) => {
    const creator = users.find(u => u.id === creatorId)
    return creator ? `${creator.nombre} ${creator.apellido}` : 'Usuario desconocido'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header mejorado */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                Eventos
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona todos los eventos de la plataforma
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {events.length} {events.length === 1 ? 'evento' : 'eventos'}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {events.filter(e => e.finalizado).length} finalizados
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {canCreateEvent && (
                <Link href="/eventos/nuevo">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Evento
                  </Button>
                </Link>
              )}
              
              {session.rol === 'admin' && (
                <Link href="/admin/usuarios">
                  <Button variant="outline" size="lg">
                    <Users className="h-4 w-4 mr-2" />
                    Administrar Usuarios
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

      {events.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No hay eventos registrados
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {canCreateEvent 
                ? 'Comienza creando tu primer evento y organiza tus actividades de manera eficiente'
                : 'Los eventos aparecerán aquí cuando sean creados por los colaboradores'
              }
            </p>
            {canCreateEvent && (
              <Link href="/eventos/nuevo">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Evento
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.titulo}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {event.sector}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.categoria}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-3">
                    {event.finalizado ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Finalizado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium">
                        {new Date(event.fecha).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span className="truncate">{event.ubicacion}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <Users className="h-4 w-4 mr-2 text-purple-600" />
                      <span>{event.numeroConvocados} convocados</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-gray-500">
                        Creado por: <span className="font-medium text-gray-700">{getCreatorName(event.creadoPor)}</span>
                      </div>
                    </div>
                    
                    {event.asignadoA && event.asignadoA !== event.creadoPor && (
                      <div className="text-xs text-blue-600 mb-3">
                        Asignado a: <span className="font-medium">{getCreatorName(event.asignadoA)}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Link href={`/eventos/${event.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-sm">
                          Ver Detalles
                        </Button>
                      </Link>
                      
                      {/* Botones de acción */}
                      {(session.rol === 'admin' || (session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado)) && (
                        <Link href={`/eventos/${event.id}/editar`}>
                          <Button variant="outline" size="sm" className="px-3">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      
                      {(session.rol === 'admin' || (session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado)) && (
                        <form action={`/api/eventos/${event.id}`} method="DELETE" className="inline">
                          <Button type="submit" variant="destructive" size="sm" className="px-3">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                      
                      {session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado && (
                        <form action={`/api/eventos/${event.id}/finalizar`} method="POST" className="inline">
                          <Button type="submit" size="sm" className="px-3 bg-green-600 hover:bg-green-700">
                            <Flag className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
