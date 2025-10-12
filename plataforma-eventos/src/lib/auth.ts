import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db, type User } from './database'
import bcrypt from 'bcryptjs'

export interface SessionUser {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: 'admin' | 'colaborador'
  aprobado: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(user: User): Promise<void> {
  const sessionUser: SessionUser = {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    rol: user.rol,
    aprobado: user.aprobado
  }
  
  const cookieStore = cookies()
  const sessionData = JSON.stringify(sessionUser)
  
  cookieStore.set('session', sessionData, {
    httpOnly: true,
    secure: false, // Cambiar a false para desarrollo
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/' // Agregar path explícito
  })
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    console.log('🔍 DEBUG GETSESSION: Obteniendo sesión...')
    const cookieStore = cookies()
    
    // Debug: listar todas las cookies
    const allCookies = cookieStore.getAll()
    console.log('🔍 DEBUG GETSESSION: Todas las cookies:', allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 50) + '...' })))
    
    const sessionCookie = cookieStore.get('session')
    
    console.log('🔍 DEBUG GETSESSION: Cookie encontrada:', sessionCookie ? 'SÍ' : 'NO')
    if (sessionCookie) {
      console.log('🔍 DEBUG GETSESSION: Valor de cookie:', sessionCookie.value)
    }
    
    if (!sessionCookie) {
      console.log('❌ DEBUG GETSESSION: No hay cookie de sesión')
      return null
    }
    
    const sessionUser = JSON.parse(sessionCookie.value) as SessionUser
    console.log('✅ DEBUG GETSESSION: Sesión parseada:', sessionUser)
    return sessionUser
  } catch (error) {
    console.error('❌ DEBUG GETSESSION: Error parseando sesión:', error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete('session')
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  if (!session.aprobado) {
    redirect('/login?message=Tu cuenta está pendiente de aprobación')
  }
  
  return session
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth()
  
  if (session.rol !== 'admin') {
    redirect('/eventos')
  }
  
  return session
}

export async function login(email: string, password: string): Promise<{ success: boolean; message: string; user?: SessionUser }> {
  try {
    const users = await db.getUsers()
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return { success: false, message: 'Credenciales incorrectas' }
    }
    
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return { success: false, message: 'Credenciales incorrectas' }
    }
    
    if (!user.aprobado) {
      return { success: false, message: 'Tu cuenta está pendiente de aprobación' }
    }
    
    await createSession(user)
    
    const sessionUser: SessionUser = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      aprobado: user.aprobado
    }
    
    return { success: true, message: 'Login exitoso', user: sessionUser }
  } catch (error) {
    console.error('Error en login:', error)
    return { success: false, message: 'Error interno del servidor' }
  }
}

export async function register(userData: {
  nombre: string
  apellido: string
  email: string
  celular: string
  sector: string
  password: string
}): Promise<{ success: boolean; message: string }> {
  try {
    const users = await db.getUsers()
    
    // Verificar si el email ya existe
    const existingUser = users.find(u => u.email === userData.email)
    if (existingUser) {
      return { success: false, message: 'El email ya está registrado' }
    }
    
    // Hash de la contraseña
    const hashedPassword = await hashPassword(userData.password)
    
    // Crear usuario (solo colaborador, pendiente de aprobación)
    await db.createUser({
      ...userData,
      password: hashedPassword,
      rol: 'colaborador',
      aprobado: false
    })
    
    return { success: true, message: 'Registro exitoso. Tu cuenta está pendiente de aprobación.' }
  } catch (error) {
    console.error('Error en registro:', error)
    return { success: false, message: 'Error interno del servidor' }
  }
}

