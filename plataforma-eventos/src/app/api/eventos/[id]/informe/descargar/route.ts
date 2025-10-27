import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth()
    const eventId = params.id
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('file')

    // Verificar que el evento existe
    const events = await db.getEvents()
    const event = events.find(e => e.id === eventId)

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos - solo el creador, usuario asignado o admin pueden descargar
    const canDownload = event.creadoPor === session.id || 
                       event.asignadoA === session.id || 
                       session.rol === 'admin'
    
    if (!canDownload) {
      return NextResponse.json(
        { success: false, message: 'No tienes permisos para descargar archivos de este evento' },
        { status: 403 }
      )
    }

    // Verificar que el evento tiene informe
    if (!event.informe) {
      return NextResponse.json(
        { success: false, message: 'El evento no tiene informe' },
        { status: 404 }
      )
    }

    // Si no se especifica archivo, devolver lista de archivos disponibles
    if (!fileName) {
      const files = [
        ...event.informe.imagenes.map(img => ({ name: img, type: 'imagen' })),
        ...event.informe.videos.map(vid => ({ name: vid, type: 'video' }))
      ]
      
      return NextResponse.json({
        success: true,
        files: files
      })
    }

    // Verificar que el archivo existe en el informe
    const allFiles = [...event.informe.imagenes, ...event.informe.videos]
    if (!allFiles.includes(fileName)) {
      return NextResponse.json(
        { success: false, message: 'Archivo no encontrado en el informe' },
        { status: 404 }
      )
    }

    // Construir ruta del archivo
    const filePath = join(process.cwd(), 'public', 'uploads', eventId, fileName)
    
    // Verificar que el archivo existe físicamente
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: 'Archivo no encontrado en el servidor' },
        { status: 404 }
      )
    }

    // Leer el archivo
    const fileBuffer = await readFile(filePath)
    
    // Determinar el tipo MIME
    const extension = fileName.split('.').pop()?.toLowerCase()
    let mimeType = 'application/octet-stream'
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg'
        break
      case 'png':
        mimeType = 'image/png'
        break
      case 'gif':
        mimeType = 'image/gif'
        break
      case 'mp4':
        mimeType = 'video/mp4'
        break
      case 'mov':
        mimeType = 'video/quicktime'
        break
      case 'avi':
        mimeType = 'video/x-msvideo'
        break
    }

    // Devolver el archivo
    return new NextResponse(fileBuffer as any, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Error descargando archivo:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
