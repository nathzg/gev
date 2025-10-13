'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, X } from 'lucide-react'

// Forzar que la página sea dinámica
export const dynamic = 'force-dynamic'

const SECTORS = [
  'Educación',
  'Salud',
  'Agricultura',
  'Servicios',
  'Tecnología',
  'Comercio',
  'Turismo',
  'Otro'
]

const CATEGORIES = [
  'Reunión',
  'Capacitación',
  'Taller',
  'Conferencia',
  'Evento Social',
  'Ceremonia',
  'Otro'
]

export default function NuevoEventoPage() {
  const [formData, setFormData] = useState({
    sector: '',
    categoria: '',
    titulo: '',
    descripcion: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    ubicacion: '',
    numeroConvocados: '',
    contactos: [{ id: '1', nombre: '', telefono: '', email: '' }],
    autoridades: [{ id: '1', nombre: '', cargo: '' }],
    asignadoA: '' // Campo para asignar el evento
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<Array<{id: string, nombre: string, apellido: string, email: string, rol: string}>>([])
  const [currentUser, setCurrentUser] = useState<{id: string, rol: string} | null>(null)
  const router = useRouter()

  // Cargar usuarios y información del usuario actual
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar información del usuario actual
        const sessionResponse = await fetch('/api/auth/session')
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          if (sessionData.success && sessionData.user) {
            setCurrentUser(sessionData.user)
            // Si es admin, cargar lista de usuarios para asignación
            if (sessionData.user.rol === 'admin') {
              const usersResponse = await fetch('/api/admin/usuarios')
              if (usersResponse.ok) {
                const usersData = await usersResponse.json()
                if (usersData.success) {
                  setUsers(usersData.users)
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    }

    loadData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addContacto = () => {
    const newId = (formData.contactos.length + 1).toString()
    setFormData({
      ...formData,
      contactos: [...formData.contactos, { id: newId, nombre: '', telefono: '', email: '' }]
    })
  }

  const removeContacto = (id: string) => {
    if (formData.contactos.length > 1) {
      setFormData({
        ...formData,
        contactos: formData.contactos.filter(c => c.id !== id)
      })
    }
  }

  const updateContacto = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      contactos: formData.contactos.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    })
  }

  const addAutoridad = () => {
    const newId = (formData.autoridades.length + 1).toString()
    setFormData({
      ...formData,
      autoridades: [...formData.autoridades, { id: newId, nombre: '', cargo: '' }]
    })
  }

  const removeAutoridad = (id: string) => {
    if (formData.autoridades.length > 1) {
      setFormData({
        ...formData,
        autoridades: formData.autoridades.filter(a => a.id !== id)
      })
    }
  }

  const updateAutoridad = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      autoridades: formData.autoridades.map(a => 
        a.id === id ? { ...a, [field]: value } : a
      )
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          numeroConvocados: parseInt(formData.numeroConvocados),
          contactos: formData.contactos.filter(c => c.nombre.trim() !== ''),
          autoridades: formData.autoridades.filter(a => a.nombre.trim() !== '')
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/eventos')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/eventos" className="inline-flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Eventos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Evento</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Evento</CardTitle>
          <CardDescription>
            Completa todos los campos para crear un nuevo evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="sector">Sector *</Label>
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecciona un sector</option>
                  {SECTORS.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="categoria">Categoría *</Label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIES.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="titulo">Título del Evento *</Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Ej: Reunión de Coordinación Educativa"
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción *</Label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Describe los objetivos y detalles del evento..."
              />
            </div>

            {/* Fecha y hora */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="horaInicio">Hora de Inicio *</Label>
                <Input
                  id="horaInicio"
                  name="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="horaFin">Hora de Fin *</Label>
                <Input
                  id="horaFin"
                  name="horaFin"
                  type="time"
                  value={formData.horaFin}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Ubicación y convocados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ubicacion">Ubicación del Salón *</Label>
                <Input
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="Ej: Salón Principal, Auditorio Central"
                />
              </div>

              <div>
                <Label htmlFor="numeroConvocados">Número de Convocados *</Label>
                <Input
                  id="numeroConvocados"
                  name="numeroConvocados"
                  type="number"
                  min="1"
                  value={formData.numeroConvocados}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  placeholder="50"
                />
              </div>
            </div>

            {/* Contactos */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Contactos *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContacto}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Contacto
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.contactos.map((contacto, index) => (
                  <div key={contacto.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Nombre *</Label>
                      <Input
                        value={contacto.nombre}
                        onChange={(e) => updateContacto(contacto.id, 'nombre', e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label>Teléfono *</Label>
                      <Input
                        value={contacto.telefono}
                        onChange={(e) => updateContacto(contacto.id, 'telefono', e.target.value)}
                        required
                        className="mt-1"
                        placeholder="123456789"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contacto.email}
                        onChange={(e) => updateContacto(contacto.id, 'email', e.target.value)}
                        className="mt-1"
                        placeholder="email@ejemplo.com"
                      />
                    </div>
                    <div className="flex items-end">
                      {formData.contactos.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeContacto(contacto.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Autoridades */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Autoridades Asistentes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAutoridad}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Autoridad
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.autoridades.map((autoridad, index) => (
                  <div key={autoridad.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={autoridad.nombre}
                        onChange={(e) => updateAutoridad(autoridad.id, 'nombre', e.target.value)}
                        className="mt-1"
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label>Cargo</Label>
                      <Input
                        value={autoridad.cargo}
                        onChange={(e) => updateAutoridad(autoridad.id, 'cargo', e.target.value)}
                        className="mt-1"
                        placeholder="Ej: Alcalde, Director, etc."
                      />
                    </div>
                    <div className="flex items-end">
                      {formData.autoridades.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAutoridad(autoridad.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asignación de Evento (solo para admins) */}
            {currentUser?.rol === 'admin' && (
              <div>
                <Label htmlFor="asignadoA">Asignar evento a:</Label>
                <select
                  id="asignadoA"
                  name="asignadoA"
                  value={formData.asignadoA}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar usuario (opcional)</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nombre} {user.apellido} ({user.email}) - {user.rol}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Si no seleccionas un usuario, el evento se asignará automáticamente a ti.
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Creando evento...' : 'Crear Evento'}
              </Button>
              
              <Link href="/eventos">
                <Button type="button" variant="outline" size="lg">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

