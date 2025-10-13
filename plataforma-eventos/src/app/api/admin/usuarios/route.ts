import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const session = await requireAuth()
    
    // Solo admins pueden ver la lista de usuarios
    if (session.rol !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para acceder a esta información' },
        { status: 403 }
      )
    }

    const users = await db.getUsers()
    
    // Filtrar solo usuarios aprobados para asignación
    const approvedUsers = users.filter(user => user.aprobado)

    return NextResponse.json({
      success: true,
      users: approvedUsers
    })
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
