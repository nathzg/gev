'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileImage, FileVideo, Archive, Eye, Play } from 'lucide-react'

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

  // Combinar todas las imágenes y videos en un solo array
  const allMedia = [
    ...informe.imagenes.map(file => ({ name: file, type: 'image' as const })),
    ...informe.videos.map(file => ({ name: file, type: 'video' as const }))
  ]

  // Función para generar tamaños aleatorios tipo Pinterest
  const getRandomHeight = () => {
    const heights = ['h-48', 'h-56', 'h-64', 'h-72', 'h-80']
    return heights[Math.floor(Math.random() * heights.length)]
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

        {/* Botón de descargar todo arriba del grid */}
        {allMedia.length > 0 && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleDownloadAll}
              disabled={downloading === 'all'}
              variant="outline"
              size="lg"
              className="px-8"
            >
              <Archive className="h-5 w-5 mr-2" />
              {downloading === 'all' ? 'Descargando...' : 'Descargar Todo'}
            </Button>
          </div>
        )}

        {/* Grid tipo Pinterest con fotos y videos mezclados */}
        {allMedia.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Archivos Multimedia ({allMedia.length}):
            </h4>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {allMedia.map((media, index) => {
                const isVideo = media.type === 'video'
                const randomHeight = getRandomHeight()
                
                return (
                  <div 
                    key={`${media.type}-${index}`} 
                    className={`break-inside-avoid mb-4 ${randomHeight} bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden`}
                  >
                    {/* Preview del archivo */}
                    <div className="relative h-3/4 bg-gray-100 flex items-center justify-center">
                      {isVideo ? (
                        <div className="text-center p-4">
                          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                          <FileVideo className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500 font-medium">Video</p>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500 font-medium">Imagen</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Información y botones */}
                    <div className="p-3 h-1/4 flex flex-col justify-between">
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 truncate font-medium" title={media.name}>
                          {media.name}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewFile(media.name)}
                          className="flex-1 text-xs px-2 py-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadFile(media.name)}
                          disabled={downloading === media.name}
                          className="flex-1 text-xs px-2 py-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {downloading === media.name ? '...' : 'Desc'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
