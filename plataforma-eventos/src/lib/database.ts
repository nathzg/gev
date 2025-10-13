import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Asegurar que el directorio data existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export interface User {
  id: string
  nombre: string
  apellido: string
  email: string
  celular: string
  sector: string
  rol: 'admin' | 'colaborador'
  password: string
  aprobado: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  sector: string
  categoria: string
  titulo: string
  descripcion: string
  contactos: Array<{
    id: string
    nombre: string
    telefono: string
    email?: string
  }>
  fecha: string
  horaInicio: string
  horaFin: string
  ubicacion: string
  numeroConvocados: number
  autoridades: Array<{
    id: string
    nombre: string
    cargo: string
  }>
  creadoPor: string
  finalizado: boolean
  informe?: {
    resumen: string
    imagenes: string[]
    videos: string[]
    subidoEn: string
  }
  qrCode?: {
    data: string
    url: string
    generadoEn: string
  }
  createdAt: string
  updatedAt: string
}

export interface Pregunta {
  id: string
  eventId: string
  nombre?: string
  pregunta: string
  createdAt: string
}

export interface Log {
  id: string
  timestamp: string
  actor: string
  action: string
  targetId?: string
  meta?: Record<string, any>
}

class Database {
  private usersFile = path.join(DATA_DIR, 'users.json')
  private eventsFile = path.join(DATA_DIR, 'events.json')
  private preguntasFile = path.join(DATA_DIR, 'preguntas.json')
  private logsFile = path.join(DATA_DIR, 'logs.json')

  // Inicializar archivos si no existen
  private initializeFiles() {
    if (!fs.existsSync(this.usersFile)) {
      fs.writeFileSync(this.usersFile, JSON.stringify([], null, 2))
    }
    if (!fs.existsSync(this.eventsFile)) {
      fs.writeFileSync(this.eventsFile, JSON.stringify([], null, 2))
    }
    if (!fs.existsSync(this.preguntasFile)) {
      fs.writeFileSync(this.preguntasFile, JSON.stringify([], null, 2))
    }
    if (!fs.existsSync(this.logsFile)) {
      fs.writeFileSync(this.logsFile, JSON.stringify([], null, 2))
    }
  }

  // Usuarios
  async getUsers(): Promise<User[]> {
    this.initializeFiles()
    const data = fs.readFileSync(this.usersFile, 'utf8')
    return JSON.parse(data)
  }

  async saveUsers(users: User[]): Promise<void> {
    this.initializeFiles()
    fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2))
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const users = await this.getUsers()
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    users.push(newUser)
    await this.saveUsers(users)
    return newUser
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsers()
    const userIndex = users.findIndex(u => u.id === id)
    if (userIndex === -1) return null

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await this.saveUsers(users)
    return users[userIndex]
  }

  // Eventos
  async getEvents(): Promise<Event[]> {
    this.initializeFiles()
    const data = fs.readFileSync(this.eventsFile, 'utf8')
    return JSON.parse(data)
  }

  async saveEvents(events: Event[]): Promise<void> {
    this.initializeFiles()
    fs.writeFileSync(this.eventsFile, JSON.stringify(events, null, 2))
  }

  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const events = await this.getEvents()
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    events.push(newEvent)
    await this.saveEvents(events)
    return newEvent
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const events = await this.getEvents()
    const eventIndex = events.findIndex(e => e.id === id)
    if (eventIndex === -1) return null

    events[eventIndex] = {
      ...events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await this.saveEvents(events)
    return events[eventIndex]
  }

  async deleteEvent(id: string): Promise<boolean> {
    const events = await this.getEvents()
    const eventIndex = events.findIndex(e => e.id === id)
    if (eventIndex === -1) return false

    events.splice(eventIndex, 1)
    await this.saveEvents(events)
    return true
  }

  // Preguntas
  async getPreguntas(): Promise<Pregunta[]> {
    this.initializeFiles()
    const data = fs.readFileSync(this.preguntasFile, 'utf8')
    return JSON.parse(data)
  }

  async savePreguntas(preguntas: Pregunta[]): Promise<void> {
    this.initializeFiles()
    fs.writeFileSync(this.preguntasFile, JSON.stringify(preguntas, null, 2))
  }

  async createPregunta(pregunta: Omit<Pregunta, 'id' | 'createdAt'>): Promise<Pregunta> {
    const preguntas = await this.getPreguntas()
    const newPregunta: Pregunta = {
      ...pregunta,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    preguntas.push(newPregunta)
    await this.savePreguntas(preguntas)
    return newPregunta
  }

  async getPreguntasByEventId(eventId: string): Promise<Pregunta[]> {
    const preguntas = await this.getPreguntas()
    return preguntas.filter(p => p.eventId === eventId)
  }

  // Logs de auditoría
  async getLogs(): Promise<Log[]> {
    this.initializeFiles()
    const data = fs.readFileSync(this.logsFile, 'utf8')
    return JSON.parse(data)
  }

  async saveLogs(logs: Log[]): Promise<void> {
    this.initializeFiles()
    fs.writeFileSync(this.logsFile, JSON.stringify(logs, null, 2))
  }

  async createLog(log: Omit<Log, 'id' | 'timestamp'>): Promise<Log> {
    const logs = await this.getLogs()
    const newLog: Log = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString()
    }
    logs.push(newLog)
    await this.saveLogs(logs)
    return newLog
  }

  async getLogsByAction(action: string): Promise<Log[]> {
    const logs = await this.getLogs()
    return logs.filter(log => log.action === action)
  }

  async getLogsByActor(actor: string): Promise<Log[]> {
    const logs = await this.getLogs()
    return logs.filter(log => log.actor === actor)
  }
}

export const db = new Database()

