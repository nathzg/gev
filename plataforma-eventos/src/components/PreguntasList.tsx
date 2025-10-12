'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, User, Calendar } from 'lucide-react'
import { Pregunta } from '@/lib/database'

interface PreguntasListProps {
  eventId: string
  canView: boolean
}

export default function PreguntasList({ eventId, canView }: PreguntasListProps) {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!canView) return

    const fetchPreguntas = async () => {
      try {
        const response = await fetch(`/api/eventos/${eventId}/preguntas`)
        const data = await response.json()

        if (data.success) {
          setPreguntas(data.preguntas)
        } else {
          setError(data.message)
        }
      } catch (error) {
        setError('Error cargando las preguntas')
      } finally {
        setLoading(false)
      }
    }

    fetchPreguntas()
  }, [eventId, canView])

  if (!canView) {
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Preguntas del Público
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando preguntas...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Preguntas del Público
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Preguntas del Público ({preguntas.length})
        </CardTitle>
        <CardDescription>
          Preguntas recibidas a través del formulario público
        </CardDescription>
      </CardHeader>
      <CardContent>
        {preguntas.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay preguntas aún</p>
            <p className="text-sm text-gray-500 mt-2">
              Las preguntas aparecerán aquí cuando el público las envíe
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {preguntas.map((pregunta) => (
              <div key={pregunta.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-600">
                    {pregunta.nombre ? (
                      <>
                        <User className="h-4 w-4 mr-1" />
                        {pregunta.nombre}
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-1" />
                        Anónimo
                      </>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(pregunta.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <p className="text-gray-800">{pregunta.pregunta}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
