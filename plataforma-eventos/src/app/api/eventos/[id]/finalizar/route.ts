import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'

export async function POST(
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

    // Solo el creador del evento puede finalizarlo
    if (event.creadoPor !== session.id) {
      return NextResponse.json(
        { success: false, message: 'Solo el creador del evento puede finalizarlo' },
        { status: 403 }
      )
    }

    // No se puede finalizar un evento ya finalizado
    if (event.finalizado) {
      return NextResponse.json(
        { success: false, message: 'El evento ya está finalizado' },
        { status: 400 }
      )
    }

    // No se puede finalizar sin haber subido un informe
    if (!event.informe || !event.informe.resumen || event.informe.imagenes.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Debe subir un informe (resumen + al menos 1 imagen) antes de finalizar el evento' },
        { status: 400 }
      )
    }

    // Finalizar el evento
    const updatedEvent = await db.updateEvent(params.id, { finalizado: true })
    
    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, message: 'Error finalizando el evento' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Evento finalizado exitosamente',
      event: updatedEvent 
    })
  } catch (error) {
    console.error('Error finalizando evento:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

