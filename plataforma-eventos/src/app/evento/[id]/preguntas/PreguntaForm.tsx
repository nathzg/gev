'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface PreguntaFormProps {
  eventId: string
}

export function PreguntaForm({ eventId }: PreguntaFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [nombre, setNombre] = useState('')
  const [pregunta, setPregunta] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/eventos/${eventId}/preguntas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, pregunta }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setNombre('')
        setPregunta('')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Error enviando la pregunta')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">¡Pregunta enviada!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Tu pregunta ha sido enviada exitosamente. Será revisada por los organizadores del evento.
          </p>
          <Button 
            onClick={() => setSuccess(false)}
            className="w-full"
          >
            Enviar otra pregunta
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envía tu pregunta</CardTitle>
        <CardDescription>
          Haz una pregunta sobre este evento. Los organizadores la revisarán y responderán.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nombre">Nombre (opcional)</Label>
            <Input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              maxLength={100}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="pregunta">Pregunta *</Label>
            <Textarea
              id="pregunta"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              required
              maxLength={500}
              rows={4}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              {pregunta.length}/500 caracteres
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting || !pregunta.trim()}
          >
            {submitting ? 'Enviando...' : 'Enviar Pregunta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
