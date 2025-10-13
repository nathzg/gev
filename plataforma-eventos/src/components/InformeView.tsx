'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileImage, FileVideo, Archive, Eye } from 'lucide-react'

interface InformeViewProps {
  eventId: string
  informe: {
    resumen: string
    imagenes: string[]
    videos: string[]
    subidoEn: string
  }
  eventTitle: string
}

export default function InformeView({ eventId, informe, eventTitle }: InformeViewProps) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownloadFile = async (fileName: string) => {
    setDownloading(fileName)
    try {
      const response = await fetch(`/api/eventos/${eventId}/informe/descargar?file=${encodeURIComponent(fileName)}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Error descargando el archivo')
      }
    } catch (error) {
      console.error('Error descargando archivo:', error)
      alert('Error descargando el archivo')
    } finally {
      setDownloading(null)
    }
  }

  const handleDownloadAll = async () => {
    setDownloading('all')
    try {
      const response = await fetch(`/api/eventos/${eventId}/informe/descargar-zip`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `informe-${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Error descargando el archivo ZIP')
      }
    } catch (error) {
      console.error('Error descargando ZIP:', error)
      alert('Error descargando el archivo ZIP')
    } finally {
      setDownloading(null)
    }
  }

  const handleViewFile = (fileName: string) => {
    const url = `/api/eventos/${eventId}/informe/descargar?file=${encodeURIComponent(fileName)}`
    window.open(url, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-green-600">Informe del Evento</CardTitle>
            <CardDescription>
              Subido el {new Date(informe.subidoEn).toLocaleString('es-ES')}
            </CardDescription>
          </div>
          <Button
            onClick={handleDownloadAll}
            disabled={downloading === 'all'}
            variant="outline"
            size="sm"
          >
            <Archive className="h-4 w-4 mr-2" />
            {downloading === 'all' ? 'Descargando...' : 'Descargar Todo'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Resumen:</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
            {informe.resumen}
          </p>
        </div>

        {/* Imágenes */}
        {informe.imagenes.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Imágenes ({informe.imagenes.length}):
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {informe.imagenes.map((imagen, index) => (
                <div key={index} className="border rounded-lg p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileImage className="h-4 w-4 mr-1" />
                      {imagen}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewFile(imagen)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadFile(imagen)}
                      disabled={downloading === imagen}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {downloading === imagen ? '...' : 'Desc'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {informe.videos.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Videos ({informe.videos.length}):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {informe.videos.map((video, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileVideo className="h-4 w-4 mr-1" />
                      {video}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewFile(video)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadFile(video)}
                      disabled={downloading === video}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {downloading === video ? '...' : 'Desc'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
