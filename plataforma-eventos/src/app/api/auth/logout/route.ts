import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth'

export async function POST() {
  try {
    await destroySession()
    return NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente' })
  } catch (error) {
    console.error('Error en API logout:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

