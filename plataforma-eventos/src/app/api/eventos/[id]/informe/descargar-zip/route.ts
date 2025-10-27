import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import archiver from 'archiver'

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

    // Obtener todos los archivos
    const allFiles = [...event.informe.imagenes, ...event.informe.videos]
    
    if (allFiles.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No hay archivos para descargar' },
        { status: 404 }
      )
    }

    // Crear archivo ZIP
    const archive = archiver('zip', {
      zlib: { level: 9 } // Máxima compresión
    })

    // Configurar headers para descarga
    const headers = new Headers()
    headers.set('Content-Type', 'application/zip')
    headers.set('Content-Disposition', `attachment; filename="informe-${event.titulo.replace(/[^a-zA-Z0-9]/g, '_')}.zip"`)

    // Crear stream de respuesta
    const stream = new ReadableStream({
      start(controller) {
        archive.on('data', (chunk) => {
          controller.enqueue(chunk)
        })
        
        archive.on('end', () => {
          controller.close()
        })
        
        archive.on('error', (err) => {
          console.error('Error creando ZIP:', err)
          controller.error(err)
        })
      }
    })

    // Agregar archivos al ZIP
    for (const fileName of allFiles) {
      const filePath = join(process.cwd(), 'public', 'uploads', eventId, fileName)
      
      if (existsSync(filePath)) {
        const fileBuffer = await readFile(filePath)
        archive.append(fileBuffer, { name: fileName })
      }
    }

    // Agregar resumen del informe como archivo de texto
    const resumenContent = `INFORME DEL EVENTO: ${event.titulo}
Fecha: ${event.fecha}
Ubicación: ${event.ubicacion}
Sector: ${event.sector}
Categoría: ${event.categoria}

RESUMEN:
${event.informe.resumen}

ARCHIVOS INCLUIDOS:
- Imágenes: ${event.informe.imagenes.length}
- Videos: ${event.informe.videos.length}

Fecha de subida: ${new Date(event.informe.subidoEn).toLocaleString('es-ES')}
`
    
    archive.append(resumenContent, { name: 'resumen.txt' })
    
    // Finalizar el archivo
    archive.finalize()

    return new NextResponse(stream, { headers })

  } catch (error) {
    console.error('Error creando ZIP:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
