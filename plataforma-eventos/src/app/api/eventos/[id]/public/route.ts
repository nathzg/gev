import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    // Verificar que el evento existe
    const events = await db.getEvents()
    const event = events.find(e => e.id === eventId)

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Devolver solo información pública del evento
    const publicEvent = {
      id: event.id,
      titulo: event.titulo,
      descripcion: event.descripcion,
      fecha: event.fecha,
      horaInicio: event.horaInicio,
      ubicacion: event.ubicacion,
      sector: event.sector,
      categoria: event.categoria
    }

    return NextResponse.json({
      success: true,
      event: publicEvent
    })

  } catch (error) {
    console.error('Error obteniendo evento público:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
