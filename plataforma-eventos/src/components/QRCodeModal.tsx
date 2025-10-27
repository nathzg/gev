'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Download, Copy, X } from 'lucide-react'

interface QRCodeModalProps {
  eventId: string
  eventTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function QRCodeModal({ eventId, eventTitle, isOpen, onClose }: QRCodeModalProps) {
  const [loading, setLoading] = useState(false)
  const [qrData, setQrData] = useState<{ qrCode: string; url: string; generadoEn?: string } | null>(null)
  const [error, setError] = useState('')

  const generateQR = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/eventos/${eventId}/qr`)
      const data = await response.json()

      if (data.success) {
        setQrData(data)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Error generando el código QR')
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrData) return
    
    const link = document.createElement('a')
    link.download = `qr-${eventTitle.replace(/\s+/g, '-')}.png`
    link.href = qrData.qrCode
    link.click()
  }

  const copyUrl = () => {
    if (!qrData) return
    
    navigator.clipboard.writeText(qrData.url)
    // Aquí podrías mostrar un toast de confirmación
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>QR Code para Preguntas</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Genera un código QR que dirija a la página de preguntas públicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {!qrData && (
            <div className="text-center">
              <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Haz clic en el botón para obtener el código QR
              </p>
              <Button onClick={generateQR} disabled={loading}>
                {loading ? 'Cargando...' : 'Obtener QR Code'}
              </Button>
            </div>
          )}

          {qrData && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={qrData.qrCode} 
                  alt="QR Code" 
                  className="border rounded-lg"
                />
              </div>
              
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 mb-2">URL de preguntas:</p>
                <p className="text-xs font-mono break-all">{qrData.url}</p>
                {qrData.generadoEn && (
                  <p className="text-xs text-gray-500 mt-2">
                    Generado el: {new Date(qrData.generadoEn).toLocaleString('es-ES')}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadQR} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
                <Button onClick={copyUrl} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar URL
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
