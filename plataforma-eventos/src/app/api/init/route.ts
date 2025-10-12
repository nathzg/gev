import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed'

export async function POST() {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: 'Datos inicializados correctamente' })
  } catch (error) {
    console.error('Error inicializando datos:', error)
    return NextResponse.json({ success: false, message: 'Error inicializando datos' }, { status: 500 })
  }
}
