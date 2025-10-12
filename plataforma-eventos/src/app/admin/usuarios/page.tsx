import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, User, Mail, Phone, Building } from 'lucide-react'

export default async function AdminUsuariosPage() {
  const session = await requireAdmin()
  const users = await db.getUsers()

  const pendingUsers = users.filter(u => !u.aprobado)
  const approvedUsers = users.filter(u => u.aprobado)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/eventos" className="inline-flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Eventos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Administración de Usuarios</h1>
        <p className="text-gray-600 mt-2">
          Gestiona los usuarios del sistema
        </p>
      </div>

      {/* Usuarios pendientes */}
      {pendingUsers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Usuarios Pendientes de Aprobación ({pendingUsers.length})
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingUsers.map((user) => (
              <Card key={user.id} className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{user.nombre} {user.apellido}</CardTitle>
                      <CardDescription className="mt-1">
                        {user.rol === 'admin' ? 'Administrador' : 'Colaborador'}
                      </CardDescription>
                    </div>
                    <XCircle className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.celular}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {user.sector}
                    </div>
                    
                    <div className="pt-3 border-t border-yellow-200">
                      <form action={`/api/admin/usuarios/${user.id}/aprobar`} method="POST" className="inline">
                        <Button type="submit" className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprobar Usuario
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Usuarios aprobados */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Usuarios Aprobados ({approvedUsers.length})
        </h2>
        
        {approvedUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay usuarios aprobados
              </h3>
              <p className="text-gray-600">
                Los usuarios aprobados aparecerán aquí
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvedUsers.map((user) => (
              <Card key={user.id} className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{user.nombre} {user.apellido}</CardTitle>
                      <CardDescription className="mt-1">
                        {user.rol === 'admin' ? 'Administrador' : 'Colaborador'}
                      </CardDescription>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.celular}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      {user.sector}
                    </div>
                    
                    <div className="pt-3 border-t border-green-200">
                      <p className="text-sm text-green-600 font-medium">
                        Usuario activo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

