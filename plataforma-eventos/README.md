# 🎯 Plataforma de Manejo de Eventos

Sistema web moderno para la gestión de eventos con roles y permisos, completamente containerizado con Docker.

## 🧱 Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Docker** para containerización
- **Almacenamiento JSON** con volúmenes persistentes

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose instalados

### Instalación y Ejecución

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd plataforma-eventos
```

2. **Construir y ejecutar con Docker**
```bash
# Limpiar archivos macOS (si es necesario)
find . -name "._*" -delete && find . -name ".DS_Store" -delete

# Construir y ejecutar
docker-compose up -d --build
```

3. **Acceder a la aplicación**
- URL: http://localhost:3000

## 👥 Usuarios de Prueba

### 👨‍💼 Administrador
- **Email**: admin@eventos.com
- **Password**: admin123
- **Permisos**: Gestión completa de usuarios y eventos

### 👨‍🏫 Colaborador
- **Email**: juan@eventos.com
- **Password**: juan123
- **Permisos**: Crear y gestionar sus propios eventos

### 👩‍⚕️ Usuario Pendiente
- **Email**: maria@eventos.com
- **Password**: maria123
- **Estado**: Pendiente de aprobación por admin

## 🏗️ Estructura del Proyecto

```
plataforma-eventos/
├── Dockerfile                 # Imagen Docker
├── docker-compose.yml         # Orquestación
├── package.json              # Dependencias
├── src/
│   ├── app/                  # App Router de Next.js
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de registro
│   │   ├── eventos/         # Gestión de eventos
│   │   ├── admin/           # Panel de administración
│   │   └── api/             # API Routes
│   ├── components/ui/       # Componentes shadcn/ui
│   └── lib/                 # Utilidades y lógica
│       ├── auth.ts          # Autenticación
│       ├── database.ts      # Base de datos JSON
│       └── seed.ts          # Datos iniciales
├── public/uploads/          # Archivos subidos (volumen)
└── data/                    # Datos de la aplicación (volumen)
```

## 🐳 Docker

### Volúmenes Persistentes
- `uploads_data`: Archivos subidos por usuarios
- `app_data`: Datos de la aplicación (usuarios, eventos)

### Comandos Útiles
```bash
# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Reconstruir imagen
docker-compose up -d --build
```

## 🧩 Funcionalidades

### ✅ Implementadas
- **Sistema de autenticación** (login/registro)
- **Gestión de roles** (Admin/Colaborador)
- **Aprobación de usuarios** (panel admin)
- **CRUD completo de eventos**
- **Permisos por rol** (admin puede todo, colaborador solo sus eventos)
- **Finalización de eventos** (solo el creador)
- **Gestión de contactos** (múltiples por evento)
- **Gestión de autoridades** (múltiples por evento)
- **Interfaz responsive** y accesible
- **Validaciones** de campos requeridos

### 🚧 Próximas Funcionalidades
- Subida de archivos (imágenes/documentos)
- Filtros y búsqueda avanzada
- Notificaciones
- Reportes y estadísticas

## 🎨 Diseño

- **Responsive**: Adaptable a todos los dispositivos
- **Accesible**: Fuentes grandes y botones para adultos mayores
- **Moderno**: Componentes shadcn/ui
- **Intuitivo**: Navegación clara y minimalista

## 🔧 Desarrollo

### Instalación Local (sin Docker)
```bash
npm install
npm run dev
```

### Variables de Entorno
No se requieren variables de entorno adicionales para el funcionamiento básico.

## 📝 Licencia

Este proyecto es privado y confidencial.
