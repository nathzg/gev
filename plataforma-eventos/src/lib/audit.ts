import { db } from './database'

export interface AuditLogData {
  actor: string
  action: string
  targetId?: string
  meta?: Record<string, any>
}

export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await db.createLog(data)
  } catch (error) {
    console.error('Error creando log de auditoría:', error)
    // No lanzamos el error para no interrumpir el flujo principal
  }
}

// Funciones helper para acciones comunes
export async function logEventCreation(actor: string, eventId: string, eventTitle: string): Promise<void> {
  await createAuditLog({
    actor,
    action: 'crear_evento',
    targetId: eventId,
    meta: { nombreEvento: eventTitle }
  })
}

export async function logEventUpdate(actor: string, eventId: string, eventTitle: string): Promise<void> {
  await createAuditLog({
    actor,
    action: 'editar_evento',
    targetId: eventId,
    meta: { nombreEvento: eventTitle }
  })
}

export async function logEventDeletion(actor: string, eventId: string, eventTitle: string): Promise<void> {
  await createAuditLog({
    actor,
    action: 'eliminar_evento',
    targetId: eventId,
    meta: { nombreEvento: eventTitle }
  })
}

export async function logEventFinalization(actor: string, eventId: string, eventTitle: string): Promise<void> {
  await createAuditLog({
    actor,
    action: 'finalizar_evento',
    targetId: eventId,
    meta: { nombreEvento: eventTitle }
  })
}

export async function logReportUpload(actor: string, eventId: string, eventTitle: string): Promise<void> {
  await createAuditLog({
    actor,
    action: 'subir_informe',
    targetId: eventId,
    meta: { nombreEvento: eventTitle }
  })
}

export async function logUserRegistration(actor: string, userId: string, userEmail: string): Promise<void> {
  await createAuditLog({
    actor,
    action: 'registrar_usuario',
    targetId: userId,
    meta: { emailUsuario: userEmail }
  })
}

export async function logUserApproval(actor: string, userId: string, userEmail: string): Promise<void> {
  await createAuditLog({
    actor,
    action: 'aprobar_usuario',
    targetId: userId,
    meta: { emailUsuario: userEmail }
  })
}

export async function logPublicQuestion(actor: string, eventId: string, eventTitle: string): Promise<void> {
  await createAuditLog({
    actor,
    action: 'enviar_pregunta_publica',
    targetId: eventId,
    meta: { nombreEvento: eventTitle }
  })
}
