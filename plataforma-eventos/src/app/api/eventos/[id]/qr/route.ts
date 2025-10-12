import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import QRCode from 'qrcode'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
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

    // Solo el dueño del evento o admin puede generar el QR
    if (event.creadoPor !== session.id && session.rol !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para generar el QR de este evento' },
        { status: 403 }
      )
    }

    // Generar URL pública para preguntas
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const preguntaUrl = `${baseUrl}/evento/${eventId}/preguntas`

    // Generar QR Code
    const qrCodeDataURL = await QRCode.toDataURL(preguntaUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataURL,
      url: preguntaUrl,
      event: {
        id: event.id,
        titulo: event.titulo
      }
    })

  } catch (error) {
    console.error('Error generando QR:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
