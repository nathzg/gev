import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import { logEventUpdate, logEventDeletion } from '@/lib/audit'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const events = await db.getEvents()
    const event = events.find(e => e.id === params.id)
    
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Error obteniendo evento:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const events = await db.getEvents()
    const event = events.find(e => e.id === params.id)
    
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos: admin puede editar cualquier evento, colaborador solo los suyos
    if (session.rol !== 'admin' && event.creadoPor !== session.id) {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para editar este evento' },
        { status: 403 }
      )
    }

    // No se puede editar un evento finalizado
    if (event.finalizado) {
      return NextResponse.json(
        { success: false, message: 'No se puede editar un evento finalizado' },
        { status: 400 }
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

    // Actualizar el evento
    const updatedEvent = await db.updateEvent(params.id, eventData)
    
    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, message: 'Error actualizando el evento' },
        { status: 500 }
      )
    }

    // Registrar en logs de auditoría
    await logEventUpdate(session.email, updatedEvent.id, updatedEvent.titulo)

    return NextResponse.json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error('Error actualizando evento:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const events = await db.getEvents()
    const event = events.find(e => e.id === params.id)
    
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos: admin puede eliminar cualquier evento, colaborador solo los suyos
    if (session.rol !== 'admin' && event.creadoPor !== session.id) {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para eliminar este evento' },
        { status: 403 }
      )
    }

    // No se puede eliminar un evento finalizado
    if (event.finalizado) {
      return NextResponse.json(
        { success: false, message: 'No se puede eliminar un evento finalizado' },
        { status: 400 }
      )
    }

    const success = await db.deleteEvent(params.id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Error eliminando el evento' },
        { status: 500 }
      )
    }

    // Registrar en logs de auditoría
    await logEventDeletion(session.email, event.id, event.titulo)

    return NextResponse.json({ success: true, message: 'Evento eliminado exitosamente' })
  } catch (error) {
    console.error('Error eliminando evento:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

