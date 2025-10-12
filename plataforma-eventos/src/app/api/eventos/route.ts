import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'

export async function GET() {
  try {
    const session = await requireAuth()
    const events = await db.getEvents()
    
    return NextResponse.json({ success: true, events })
  } catch (error) {
    console.error('Error obteniendo eventos:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    
    // Solo admin y colaboradores pueden crear eventos
    if (session.rol !== 'admin' && session.rol !== 'colaborador') {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para crear eventos' },
        { status: 403 }
      )
    }

    const eventData = await request.json()
    
    // Validar campos requeridos
    const requiredFields = ['sector', 'categoria', 'titulo', 'descripcion', 'fecha', 'horaInicio', 'horaFin', 'ubicacion', 'numeroConvocados']
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { success: false, message: `El campo ${field} es requerido` },
          { status: 400 }
        )
      }
    }

    // Validar que haya al menos un contacto
    if (!eventData.contactos || eventData.contactos.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Debe haber al menos un contacto' },
        { status: 400 }
      )
    }

    // Crear el evento
    const newEvent = await db.createEvent({
      ...eventData,
      creadoPor: session.id,
      finalizado: false
    })

    return NextResponse.json({ success: true, event: newEvent })
  } catch (error) {
    console.error('Error creando evento:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

