import { db } from './database'
import { hashPassword } from './auth'

export async function seedDatabase() {
  try {
    const users = await db.getUsers()
    
    // Solo crear datos iniciales si no existen usuarios
    if (users.length === 0) {
      console.log('Creando datos iniciales...')
      
      // Crear usuario admin
      const adminPassword = await hashPassword('admin123')
      await db.createUser({
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@eventos.com',
        celular: '123456789',
        sector: 'Servicios',
        password: adminPassword,
        rol: 'admin',
        aprobado: true
      })
      
      // Crear usuario colaborador de ejemplo
      const colaboradorPassword = await hashPassword('juan123')
      await db.createUser({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@eventos.com',
        celular: '987654321',
        sector: 'Educación',
        password: colaboradorPassword,
        rol: 'colaborador',
        aprobado: true
      })
      
      // Crear usuario pendiente de ejemplo
      const pendientePassword = await hashPassword('maria123')
      await db.createUser({
        nombre: 'María',
        apellido: 'González',
        email: 'maria@eventos.com',
        celular: '555666777',
        sector: 'Salud',
        password: pendientePassword,
        rol: 'colaborador',
        aprobado: false
      })
      
      console.log('Datos iniciales creados exitosamente')
    }
  } catch (error) {
    console.error('Error creando datos iniciales:', error)
  }
}

