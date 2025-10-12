import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/database'
import EventoDetailClient from './EventoDetailClient'

interface EventoDetailPageProps {
  params: {
    id: string
  }
}

export default async function EventoDetailPage({ params }: EventoDetailPageProps) {
  const session = await requireAuth()
  const events = await db.getEvents()
  const event = events.find(e => e.id === params.id)

  if (!event) {
    redirect('/eventos')
  }

  // Verificar permisos
  const canEdit = session.rol === 'admin' || (session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado)
  const canDelete = session.rol === 'admin' || (session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado)
  const canFinalize = session.rol === 'colaborador' && event.creadoPor === session.id && !event.finalizado
  const canViewPreguntas = session.rol === 'admin' || event.creadoPor === session.id

  return (
    <EventoDetailClient
      event={event}
      session={session}
      canEdit={canEdit}
      canDelete={canDelete}
      canFinalize={canFinalize}
      canViewPreguntas={canViewPreguntas}
    />
  )
}