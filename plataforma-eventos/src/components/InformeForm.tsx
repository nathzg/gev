'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, X, Image, Video } from 'lucide-react'

interface InformeFormProps {
  eventId: string
  onSuccess: () => void
}

export default function InformeForm({ eventId, onSuccess }: InformeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [resumen, setResumen] = useState('')
  const [imagenes, setImagenes] = useState<File[]>([])
  const [videos, setVideos] = useState<File[]>([])

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (imagenes.length + files.length > 5) {
      setError('Máximo 5 imágenes permitidas')
      return
    }
    setImagenes(prev => [...prev, ...files])
    setError('')
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setVideos(prev => [...prev, ...files])
    setError('')
  }

  const removeImagen = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!resumen.trim()) {
      setError('El resumen es obligatorio')
      setLoading(false)
      return
    }

    if (imagenes.length === 0) {
      setError('Debe subir al menos una imagen')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('resumen', resumen)
      
      imagenes.forEach(imagen => {
        formData.append('imagenes', imagen)
      })
      
      videos.forEach(video => {
        formData.append('videos', video)
      })

      const response = await fetch(`/api/eventos/${eventId}/informe`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setResumen('')
        setImagenes([])
        setVideos([])
        onSuccess()
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Error subiendo el informe')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">¡Informe subido exitosamente!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            El informe ha sido subido correctamente. Ahora puedes finalizar el evento.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Informe del Evento</CardTitle>
        <CardDescription>
          Sube un resumen, imágenes y videos del evento realizado
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
            <Label htmlFor="resumen">Resumen del Evento *</Label>
            <Textarea
              id="resumen"
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="Describe cómo se desarrolló el evento, los resultados obtenidos, etc."
              required
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Imágenes * (máximo 5, JPG/PNG, 5MB cada una)</Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={handleImagenChange}
                className="mb-2"
              />
              {imagenes.length > 0 && (
                <div className="space-y-2">
                  {imagenes.map((imagen, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <Image className="h-4 w-4 mr-2" />
                        <span className="text-sm">{imagen.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(imagen.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImagen(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Videos (opcional, MP4, 50MB cada uno)</Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="video/mp4"
                multiple
                onChange={handleVideoChange}
                className="mb-2"
              />
              {videos.length > 0 && (
                <div className="space-y-2">
                  {videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span className="text-sm">{video.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(video.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVideo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Subiendo...' : 'Subir Informe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
