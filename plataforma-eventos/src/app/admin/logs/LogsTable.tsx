'use client'

import { useState } from 'react'
import { Log } from '@/lib/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react'

interface LogsTableProps {
  logs: Log[]
}

const ACTION_COLORS: Record<string, string> = {
  'crear_evento': 'bg-green-100 text-green-800',
  'editar_evento': 'bg-blue-100 text-blue-800',
  'eliminar_evento': 'bg-red-100 text-red-800',
  'finalizar_evento': 'bg-purple-100 text-purple-800',
  'subir_informe': 'bg-orange-100 text-orange-800',
  'registrar_usuario': 'bg-cyan-100 text-cyan-800',
  'aprobar_usuario': 'bg-emerald-100 text-emerald-800',
  'enviar_pregunta_publica': 'bg-pink-100 text-pink-800'
}

const ACTION_LABELS: Record<string, string> = {
  'crear_evento': 'Crear Evento',
  'editar_evento': 'Editar Evento',
  'eliminar_evento': 'Eliminar Evento',
  'finalizar_evento': 'Finalizar Evento',
  'subir_informe': 'Subir Informe',
  'registrar_usuario': 'Registrar Usuario',
  'aprobar_usuario': 'Aprobar Usuario',
  'enviar_pregunta_publica': 'Pregunta Pública'
}

export function LogsTable({ logs }: LogsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [sortField, setSortField] = useState<'timestamp' | 'actor' | 'action'>('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.meta?.nombreEvento?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.meta?.emailUsuario?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = !filterAction || log.action === filterAction
    
    return matchesSearch && matchesFilter
  })

  // Ordenar logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue: string
    let bValue: string

    switch (sortField) {
      case 'timestamp':
        aValue = a.timestamp
        bValue = b.timestamp
        break
      case 'actor':
        aValue = a.actor
        bValue = b.actor
        break
      case 'action':
        aValue = a.action
        bValue = b.action
        break
      default:
        aValue = a.timestamp
        bValue = b.timestamp
    }

    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  // Paginación
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: 'timestamp' | 'actor' | 'action') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getActionColor = (action: string) => {
    return ACTION_COLORS[action] || 'bg-gray-100 text-gray-800'
  }

  const getActionLabel = (action: string) => {
    return ACTION_LABELS[action] || action
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por usuario, acción o evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="">Todas las acciones</option>
            {Object.keys(ACTION_LABELS).map(action => (
              <option key={action} value={action}>
                {ACTION_LABELS[action]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-1">
                  Fecha/Hora
                  {sortField === 'timestamp' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('actor')}
              >
                <div className="flex items-center gap-1">
                  Usuario
                  {sortField === 'actor' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('action')}
              >
                <div className="flex items-center gap-1">
                  Acción
                  {sortField === 'action' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatTimestamp(log.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.actor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getActionColor(log.action)}>
                    {getActionLabel(log.action)}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {log.meta?.nombreEvento && (
                    <div>Evento: {log.meta.nombreEvento}</div>
                  )}
                  {log.meta?.emailUsuario && (
                    <div>Usuario: {log.meta.emailUsuario}</div>
                  )}
                  {log.targetId && (
                    <div className="text-xs text-gray-500">ID: {log.targetId}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedLogs.length)} de {sortedLogs.length} resultados
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="px-3 py-2 text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
