import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'No hay sesión activa'
      })
    }

    return NextResponse.json({
      success: true,
      user: session
    })
  } catch (error) {
    console.error('Error obteniendo sesión:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
