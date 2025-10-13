import { NextRequest, NextResponse } from 'next/server'
import { register } from '@/lib/auth'
import { logUserRegistration } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const { nombre, apellido, email, celular, sector, password } = await request.json()

    if (!nombre || !apellido || !email || !celular || !sector || !password) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const result = await register({
      nombre,
      apellido,
      email,
      celular,
      sector,
      password
    })

    // Registrar en logs de auditoría si el registro fue exitoso
    if (result.success && result.user) {
      await logUserRegistration(email, result.user.id, email)
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error en API register:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

