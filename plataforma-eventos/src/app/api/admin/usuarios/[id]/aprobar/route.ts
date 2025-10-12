import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/database'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    
    const users = await db.getUsers()
    const user = users.find(u => u.id === params.id)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (user.aprobado) {
      return NextResponse.json(
        { success: false, message: 'El usuario ya está aprobado' },
        { status: 400 }
      )
    }

    // Aprobar el usuario
    const updatedUser = await db.updateUser(params.id, { aprobado: true })
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'Error aprobando el usuario' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Usuario aprobado exitosamente',
      user: updatedUser 
    })
  } catch (error) {
    console.error('Error aprobando usuario:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

