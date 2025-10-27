'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { User, Mail, Phone, Building, Lock, Loader2, CheckCircle } from 'lucide-react'

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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    sector: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const { toast } = useToast()

  const validateField = (name: string, value: string) => {
    const errors = { ...fieldErrors }
    
    switch (name) {
      case 'nombre':
      case 'apellido':
        if (!value.trim()) {
          errors[name] = 'Este campo es requerido'
        } else if (value.length < 2) {
          errors[name] = 'Debe tener al menos 2 caracteres'
        } else {
          delete errors[name]
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          errors[name] = 'El correo electrónico es requerido'
        } else if (!emailRegex.test(value)) {
          errors[name] = 'Ingresa un correo electrónico válido'
        } else {
          delete errors[name]
        }
        break
      case 'celular':
        if (!value) {
          errors[name] = 'El celular es requerido'
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          errors[name] = 'Ingresa un número de celular válido (10 dígitos)'
        } else {
          delete errors[name]
        }
        break
      case 'sector':
        if (!value) {
          errors[name] = 'Selecciona un sector'
        } else {
          delete errors[name]
        }
        break
      case 'password':
        if (!value) {
          errors[name] = 'La contraseña es requerida'
        } else if (value.length < 6) {
          errors[name] = 'Debe tener al menos 6 caracteres'
        } else {
          delete errors[name]
        }
        break
      case 'confirmPassword':
        if (!value) {
          errors[name] = 'Confirma tu contraseña'
        } else if (value !== formData.password) {
          errors[name] = 'Las contraseñas no coinciden'
        } else {
          delete errors[name]
        }
        break
    }
    
    setFieldErrors(errors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Validar en tiempo real
    if (name === 'confirmPassword') {
      validateField(name, value)
    } else {
      validateField(name, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar todos los campos
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof typeof formData])
    })
    
    // Verificar si hay errores
    if (Object.keys(fieldErrors).length > 0) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          celular: formData.celular,
          sector: formData.sector,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada. Un administrador la revisará pronto.",
          variant: "success",
        })
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        toast({
          title: "Error en el registro",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al servidor. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-xl border-0">
            <CardContent className="text-center py-12">
              <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Registro Exitoso!</h2>
              <p className="text-gray-600 mb-6">
                Tu cuenta ha sido creada correctamente. Un administrador la revisará y te notificará cuando esté aprobada.
              </p>
              <div className="animate-pulse">
                <p className="text-sm text-gray-500">Redirigiendo al login...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Crear Cuenta</CardTitle>
            <CardDescription className="text-gray-600">
              Únete a la plataforma de gestión de eventos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                    Nombre *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={handleChange}
                      onBlur={() => validateField('nombre', formData.nombre)}
                      className={`pl-10 ${fieldErrors.nombre ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Tu nombre"
                    />
                  </div>
                  {fieldErrors.nombre && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {fieldErrors.nombre}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apellido" className="text-sm font-medium text-gray-700">
                    Apellido *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="apellido"
                      name="apellido"
                      type="text"
                      value={formData.apellido}
                      onChange={handleChange}
                      onBlur={() => validateField('apellido', formData.apellido)}
                      className={`pl-10 ${fieldErrors.apellido ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Tu apellido"
                    />
                  </div>
                  {fieldErrors.apellido && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {fieldErrors.apellido}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => validateField('email', formData.email)}
                    className={`pl-10 ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="tu@email.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular" className="text-sm font-medium text-gray-700">
                  Celular *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="celular"
                    name="celular"
                    type="tel"
                    value={formData.celular}
                    onChange={handleChange}
                    onBlur={() => validateField('celular', formData.celular)}
                    className={`pl-10 ${fieldErrors.celular ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="300 123 4567"
                  />
                </div>
                {fieldErrors.celular && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {fieldErrors.celular}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector" className="text-sm font-medium text-gray-700">
                  Sector *
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    onBlur={() => validateField('sector', formData.sector)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${fieldErrors.sector ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Selecciona un sector</option>
                    {SECTORS.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.sector && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {fieldErrors.sector}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => validateField('password', formData.password)}
                      className={`pl-10 ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar Contraseña *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => validateField('confirmPassword', formData.confirmPassword)}
                      className={`pl-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}