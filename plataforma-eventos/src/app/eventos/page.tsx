import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Calendar, MapPin, Users, User, CheckCircle, Clock, Edit, Trash2, Flag } from 'lucide-react'

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona todos los eventos de la plataforma
          </p>
        </div>
        
        <div className="flex gap-4">
          {canCreateEvent && (
            <Link href="/eventos/nuevo">
              <Button size="lg">
                Crear Evento
              </Button>
            </Link>
          )}
          
          {session.rol === 'admin' && (
            <Link href="/admin/usuarios">
              <Button variant="outline" size="lg">
                Administrar Usuarios
              </Button>
            </Link>
          )}
          
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="ghost" size="lg">
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay eventos registrados
            </h3>
            <p className="text-gray-600 mb-4">
              {canCreateEvent 
                ? 'Comienza creando tu primer evento'
                : 'Los eventos aparecerán aquí cuando sean creados'
              }
            </p>
            {canCreateEvent && (
              <Link href="/eventos/nuevo">
                <Button>Crear Primer Evento</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{event.titulo}</CardTitle>
                    <CardDescription className="mt-1">
                      {event.sector} • {event.categoria}
                    </CardDescription>
                  </div>
                  {event.finalizado ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.ubicacion}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {event.numeroConvocados} convocados
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    Creado por: {getCreatorName(event.creadoPor)}
                  </div>
                  
                  {event.asignadoA && event.asignadoA !== event.creadoPor && (
                    <div className="flex items-center text-sm text-blue-600">
                      <User className="h-4 w-4 mr-2" />
                      Asignado a: {getCreatorName(event.asignadoA)}
                    </div>
                  )}
                  
                  <div className="pt-3 border-t">
                    <div className="flex gap-2">
                      <Link href={`/eventos/${event.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Ver Detalles
                        </Button>
                      </Link>
                      
                      {/* Botones de acción */}
                      {(session.rol === 'admin' || (session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado)) && (
                        <Link href={`/eventos/${event.id}/editar`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      
                      {(session.rol === 'admin' || (session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado)) && (
                        <form action={`/api/eventos/${event.id}`} method="DELETE" className="inline">
                          <Button type="submit" variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                      
                      {session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado && (
                        <form action={`/api/eventos/${event.id}/finalizar`} method="POST" className="inline">
                          <Button type="submit" size="sm">
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
