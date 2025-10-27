import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/lib/database'
import { PreguntaForm } from './PreguntaForm'

// Forzar que la página sea dinámica
export const dynamic = 'force-dynamic'

interface Event {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  horaInicio: string
  ubicacion: string
  sector: string
  categoria: string
}

interface PreguntasPageProps {
  params: {
    id: string
  }
}

async function getEvent(eventId: string): Promise<Event | null> {
  try {
    const events = await db.getEvents()
    const event = events.find(e => e.id === eventId)
    
    if (!event) {
      return null
    }

    return {
      id: event.id,
      titulo: event.titulo,
      descripcion: event.descripcion,
      fecha: event.fecha,
      horaInicio: event.horaInicio,
      ubicacion: event.ubicacion,
      sector: event.sector,
      categoria: event.categoria
    }
  } catch (error) {
    console.error('Error obteniendo evento:', error)
    return null
  }
}

export default async function PreguntasPage({ params }: PreguntasPageProps) {
  const eventId = params.id
  const event = await getEvent(eventId)

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">Evento no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Información del evento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{event.titulo}</CardTitle>
            <CardDescription>
              {event.fecha} a las {event.horaInicio} - {event.ubicacion}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{event.descripcion}</p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {event.sector}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {event.categoria}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de preguntas */}
        <PreguntaForm eventId={eventId} />
      </div>
    </div>
  )
}