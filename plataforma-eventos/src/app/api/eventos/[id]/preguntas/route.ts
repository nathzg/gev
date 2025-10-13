import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { logPublicQuestion } from '@/lib/audit'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id
    const { nombre, pregunta } = await request.json()

    // Verificar que el evento existe
    const events = await db.getEvents()
    const event = events.find(e => e.id === eventId)

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Validar campos
    if (!pregunta || pregunta.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'La pregunta es obligatoria' },
        { status: 400 }
      )
    }

    if (pregunta.trim().length > 500) {
      return NextResponse.json(
        { success: false, message: 'La pregunta no puede exceder 500 caracteres' },
        { status: 400 }
      )
    }

    if (nombre && nombre.trim().length > 100) {
      return NextResponse.json(
        { success: false, message: 'El nombre no puede exceder 100 caracteres' },
        { status: 400 }
      )
    }

    // Crear la pregunta
    const newPregunta = await db.createPregunta({
      eventId,
      nombre: nombre?.trim() || undefined,
      pregunta: pregunta.trim()
    })

    // Registrar en logs de auditoría
    await logPublicQuestion('público', eventId, event.titulo)

    return NextResponse.json({
      success: true,
      message: 'Pregunta enviada exitosamente',
      pregunta: newPregunta
    })

  } catch (error) {
    console.error('Error creando pregunta:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

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

    // Obtener preguntas del evento
    const preguntas = await db.getPreguntasByEventId(eventId)

    return NextResponse.json({
      success: true,
      preguntas: preguntas.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })

  } catch (error) {
    console.error('Error obteniendo preguntas:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
