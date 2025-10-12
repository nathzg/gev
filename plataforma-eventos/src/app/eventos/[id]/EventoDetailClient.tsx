'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, Users, User, Phone, Mail, CheckCircle, Edit, Trash2, Flag, QrCode, Upload, FileText, Image, Video } from 'lucide-react'
import InformeForm from '@/components/InformeForm'
import QRCodeModal from '@/components/QRCodeModal'
import PreguntasList from '@/components/PreguntasList'
import { Event } from '@/lib/database'

interface EventoDetailClientProps {
  event: Event
  session: any
  canEdit: boolean
  canDelete: boolean
  canFinalize: boolean
  canViewPreguntas: boolean
}

export default function EventoDetailClient({ 
  event, 
  session, 
  canEdit, 
  canDelete, 
  canFinalize,
  canViewPreguntas 
}: EventoDetailClientProps) {
  const [showInformeForm, setShowInformeForm] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFinalize = async () => {
    try {
      const response = await fetch(`/api/eventos/${event.id}/finalizar`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        window.location.reload()
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert('Error finalizando el evento')
    }
  }

  const handleInformeSuccess = () => {
    setShowInformeForm(false)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/eventos" className="inline-flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Eventos
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{event.titulo}</h1>
              {event.finalizado ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-lg text-gray-600">
              {event.sector} • {event.categoria}
            </p>
          </div>
          
          <div className="flex gap-2">
            {canEdit && (
              <Link href={`/eventos/${event.id}/editar`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
            )}
            
            {canFinalize && (
              <Button 
                onClick={handleFinalize}
                variant="outline" 
                size="sm"
                className="text-green-600 hover:text-green-700"
              >
                <Flag className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            )}
            
            <Button 
              onClick={() => setShowQRModal(true)}
              variant="outline" 
              size="sm"
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">{event.fecha}</p>
                    <p className="text-sm text-gray-600">
                      {event.horaInicio} - {event.horaFin}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Ubicación</p>
                    <p className="text-sm text-gray-600">{event.ubicacion}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium">Convocados</p>
                    <p className="text-sm text-gray-600">{event.numeroConvocados} personas</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Descripción</h3>
                <p className="text-gray-600">{event.descripcion}</p>
              </div>
            </CardContent>
          </Card>

          {/* Informe del evento */}
          {event.informe && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Informe del Evento
                </CardTitle>
                <CardDescription>
                  Subido el {new Date(event.informe.subidoEn).toLocaleDateString('es-ES')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Resumen</h3>
                  <p className="text-gray-600">{event.informe.resumen}</p>
                </div>
                
                {event.informe.imagenes.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Imágenes ({event.informe.imagenes.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.informe.imagenes.map((imagen, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={imagen} 
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {event.informe.videos.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Videos ({event.informe.videos.length})</h3>
                    <div className="space-y-4">
                      {event.informe.videos.map((video, index) => (
                        <div key={index} className="relative">
                          <video 
                            src={video} 
                            controls
                            className="w-full rounded-lg"
                          >
                            Tu navegador no soporta el elemento video.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Formulario de informe (solo si no está finalizado y es el dueño) */}
          {canFinalize && !event.informe && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Subir Informe
                </CardTitle>
                <CardDescription>
                  Sube un informe del evento antes de finalizarlo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowInformeForm(true)}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Informe del Evento
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Preguntas del público */}
          <PreguntasList 
            eventId={event.id} 
            canView={canViewPreguntas}
            key={refreshKey}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contactos */}
          {event.contactos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Contactos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.contactos.map((contacto, index) => (
                  <div key={index} className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{contacto.nombre}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {contacto.telefono}
                        {contacto.email && (
                          <>
                            <Mail className="h-3 w-3 ml-2 mr-1" />
                            {contacto.email}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Autoridades */}
          {event.autoridades.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Autoridades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.autoridades.map((autoridad, index) => (
                  <div key={index}>
                    <p className="font-medium">{autoridad.nombre}</p>
                    <p className="text-sm text-gray-600">{autoridad.cargo}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modales */}
      {showInformeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <InformeForm 
              eventId={event.id} 
              onSuccess={handleInformeSuccess}
            />
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowInformeForm(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      <QRCodeModal
        eventId={event.id}
        eventTitle={event.titulo}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  )
}
