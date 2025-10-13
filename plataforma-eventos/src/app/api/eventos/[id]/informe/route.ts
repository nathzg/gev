import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { db } from '@/lib/database'
import { requireAuth } from '@/lib/auth'
import { logReportUpload } from '@/lib/audit'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const eventId = params.id

    // Verificar que el evento existe y pertenece al usuario
    const event = await db.getEvents().then(events => 
      events.find(e => e.id === eventId)
    )

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Solo el dueño del evento puede subir el informe
    if (event.creadoPor !== session.id) {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para subir el informe de este evento' },
        { status: 403 }
      )
    }

    // No se puede subir informe si el evento ya está finalizado
    if (event.finalizado) {
      return NextResponse.json(
        { success: false, message: 'No se puede subir informe a un evento finalizado' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const resumen = formData.get('resumen') as string
    const imagenes = formData.getAll('imagenes') as File[]
    const videos = formData.getAll('videos') as File[]

    if (!resumen || resumen.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'El resumen es obligatorio' },
        { status: 400 }
      )
    }

    if (imagenes.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Debe subir al menos una imagen' },
        { status: 400 }
      )
    }

    if (imagenes.length > 5) {
      return NextResponse.json(
        { success: false, message: 'Máximo 5 imágenes permitidas' },
        { status: 400 }
      )
    }

    // Crear directorio para el evento si no existe
    const uploadDir = join(process.cwd(), 'public', 'uploads', eventId)
    await mkdir(uploadDir, { recursive: true })

    const imagenPaths: string[] = []
    const videoPaths: string[] = []

    // Procesar imágenes
    for (let i = 0; i < imagenes.length; i++) {
      const imagen = imagenes[i]
      if (imagen.size > 5 * 1024 * 1024) { // 5MB
        return NextResponse.json(
          { success: false, message: `La imagen ${i + 1} excede el tamaño máximo de 5MB` },
          { status: 400 }
        )
      }

      const bytes = await imagen.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const extension = imagen.name.split('.').pop()?.toLowerCase()
      
      if (!['jpg', 'jpeg', 'png'].includes(extension || '')) {
        return NextResponse.json(
          { success: false, message: `La imagen ${i + 1} debe ser JPG, JPEG o PNG` },
          { status: 400 }
        )
      }

      const filename = `imagen_${i + 1}.${extension}`
      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)
      imagenPaths.push(`/uploads/${eventId}/${filename}`)
    }

    // Procesar videos
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i]
      if (video.size > 50 * 1024 * 1024) { // 50MB
        return NextResponse.json(
          { success: false, message: `El video ${i + 1} excede el tamaño máximo de 50MB` },
          { status: 400 }
        )
      }

      const bytes = await video.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const extension = video.name.split('.').pop()?.toLowerCase()
      
      if (extension !== 'mp4') {
        return NextResponse.json(
          { success: false, message: `El video ${i + 1} debe ser MP4` },
          { status: 400 }
        )
      }

      const filename = `video_${i + 1}.${extension}`
      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)
      videoPaths.push(`/uploads/${eventId}/${filename}`)
    }

    // Actualizar el evento con el informe
    const informe = {
      resumen: resumen.trim(),
      imagenes: imagenPaths,
      videos: videoPaths,
      subidoEn: new Date().toISOString()
    }

    const updatedEvent = await db.updateEvent(eventId, { informe })

    // Registrar en logs de auditoría
    await logReportUpload(session.email, eventId, event.titulo)

    return NextResponse.json({
      success: true,
      message: 'Informe subido exitosamente',
      informe
    })

  } catch (error) {
    console.error('Error subiendo informe:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
