# 📋 BITÁCORA - PLATAFORMA DE MANEJO DE EVENTOS

## 🎯 PROYECTO: Plataforma de Manejo de Eventos - Fase 1

### 📅 FECHA INICIO: Diciembre 2024
### 👤 CLIENTE: Usuario solicitante
### 🎯 OBJETIVO: Plataforma web moderna para gestión de eventos con Docker

---

## 🧱 STACK TECNOLÓGICO DEFINIDO

### ✅ Frontend:
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### ✅ Backend/Storage:
- **Docker** para toda la aplicación
- **Node.js 18/20** en contenedor
- **Almacenamiento**: JSON o SQLite en volumen Docker
- **Archivos estáticos**: `/app/public/uploads` (volumen persistente)

### ✅ Infraestructura:
- **Puerto**: 3000
- **Volumen persistente** para uploads
- **Docker Compose** para despliegue

---

## 🧩 FUNCIONALIDADES FASE 1

### 1. ✅ Autenticación
- **Registro**: Nombre, Apellido, Correo, Celular, Sector, Rol (colaborador)
- **Login**: Correo y contraseña
- **Aprobación**: Solo usuarios aprobados por admin pueden entrar
- **Almacenamiento**: JSON o SQLite

### 2. ✅ Roles y Permisos
#### 👨‍💼 **Admin**:
- Aprobar usuarios
- Ver, editar, eliminar cualquier evento (no finalizado)
- Acceso a `/admin/usuarios`

#### 👨‍🏫 **Colaborador**:
- Crear, editar, eliminar solo sus eventos (no finalizados)
- Finalizar únicamente sus eventos
- Ver todos los eventos (sin editar los de otros)

### 3. ✅ Eventos
#### 📋 **Campos del Evento**:
- Sector, Categoría, Título, Descripción
- Contactos (múltiples)
- Fecha, Hora inicio/fin
- Ubicación del salón
- Número de convocados
- Autoridades asistentes (múltiples)

#### 🔒 **Reglas de Negocio**:
- Solo el **dueño del evento** puede marcarlo como **finalizado**
- Eventos finalizados: **no editables**, **no eliminables**, **visibles por todos**

### 4. ✅ Rutas Definidas
- `/login` - Página de login
- `/register` - Página de registro
- `/eventos` - Lista de eventos
- `/eventos/nuevo` - Crear nuevo evento
- `/eventos/[id]` - Detalle de evento
- `/admin/usuarios` - Gestión de usuarios (solo admin)

---

## 🐳 REQUISITOS DOCKER

### ✅ Contenedor:
- **Base**: Node.js 18/20 Alpine
- **Puerto**: 3000
- **Volumen persistente**: `/app/public/uploads`

### ✅ Archivos Docker:
- `Dockerfile` - Construcción de la app Next.js
- `docker-compose.yml` - Orquestación y volúmenes

### ✅ Almacenamiento:
- **Archivos estáticos**: `/app/public/uploads` (volumen persistente)
- **Base de datos**: JSON o SQLite en volumen Docker

---

## ✨ UX/UI CONSIDERACIONES

### ✅ Diseño:
- **shadcn/ui** para componentes modernos
- **Responsive** design
- **Fuentes legibles** y **botones grandes**
- **Navegación clara** y minimalista
- **Accesible** para adultos mayores

---

## 📁 ESTRUCTURA DE ARCHIVOS ESPERADA

```
plataforma-eventos/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── eventos/
│   └── admin/
├── components/
│   └── ui/ (shadcn/ui)
├── lib/
│   ├── auth.ts
│   ├── database.ts
│   └── utils.ts
├── public/
│   └── uploads/ (volumen persistente)
└── data/
    ├── users.json
    └── events.json
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### 📋 **Fase 1 - Setup Base**:
1. ✅ Crear proyecto Next.js 14 con TypeScript
2. ✅ Configurar Tailwind CSS y shadcn/ui
3. ✅ Crear Dockerfile y docker-compose.yml
4. ✅ Configurar volúmenes persistentes

### 📋 **Fase 2 - Autenticación**:
1. ✅ Implementar sistema de registro
2. ✅ Implementar sistema de login
3. ✅ Crear middleware de autenticación
4. ✅ Implementar aprobación de usuarios

### 📋 **Fase 3 - Eventos**:
1. ✅ Crear CRUD de eventos
2. ✅ Implementar permisos por rol
3. ✅ Sistema de finalización de eventos
4. ✅ Lista y detalle de eventos

### 📋 **Fase 4 - Admin Panel**:
1. ✅ Panel de administración
2. ✅ Gestión de usuarios
3. ✅ Aprobación de usuarios

---

## 🛠️ COMANDOS DOCKER CRÍTICOS

### 🐳 **Construcción y Despliegue**:
```bash
# Construir imagen
docker build -t plataforma-eventos .

# Ejecutar con docker-compose
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

### 🌐 **Acceso por IP**:
```bash
# Ejecutar con script automático
./start.sh

# Obtener IP local
./get-ip.sh

# URLs de acceso:
# - Localhost: http://localhost:3000
# - IP Local: http://10.10.0.73:3000
```

### 🗑️ **Limpieza**:
```bash
# Limpiar archivos macOS (SIEMPRE usar -R mayúscula)
find . -name "._*" -delete && find . -name ".DS_Store" -delete

# Eliminar contenedores y volúmenes
docker-compose down -v
docker system prune -f
```

---

## 📊 ESTADO DEL PROYECTO

### 🎯 **Estado Actual**: FASE 2 - CRUD DE EVENTOS COMPLETADA
### 📅 **Última Actualización**: Diciembre 2024
### 🔄 **Próximo Paso**: Implementar panel de administración

---

## ✅ PROGRESO COMPLETADO

### 🚀 **Fase 1 - Setup Base (COMPLETADA)**:
- ✅ **Proyecto Next.js 14** creado con TypeScript
- ✅ **Tailwind CSS** configurado
- ✅ **shadcn/ui** componentes base implementados
- ✅ **Dockerfile** y **docker-compose.yml** creados
- ✅ **Volúmenes persistentes** configurados
- ✅ **Sistema de autenticación** implementado
- ✅ **Base de datos JSON** con persistencia
- ✅ **Páginas de login y registro** funcionales
- ✅ **Página de eventos** básica
- ✅ **Datos iniciales** (admin, juan, maria)

### 🚀 **Fase 2 - CRUD de Eventos (COMPLETADA)**:
- ✅ **Página crear evento** (`/eventos/nuevo`)
- ✅ **Página detalle evento** (`/eventos/[id]`)
- ✅ **Página editar evento** (`/eventos/[id]/editar`)
- ✅ **API CRUD eventos** (GET, POST, PUT, DELETE)
- ✅ **API finalizar eventos** (solo creador)
- ✅ **Permisos por rol** implementados
- ✅ **Validaciones** de campos requeridos
- ✅ **Gestión de contactos** (múltiples)
- ✅ **Gestión de autoridades** (múltiples)
- ✅ **Panel de administración** (`/admin/usuarios`)
- ✅ **API aprobar usuarios** (solo admin)

### 🏗️ **Estructura Implementada**:
```
plataforma-eventos/
├── Dockerfile ✅
├── docker-compose.yml ✅
├── package.json ✅
├── src/
│   ├── app/
│   │   ├── layout.tsx ✅
│   │   ├── page.tsx ✅
│   │   ├── login/page.tsx ✅
│   │   ├── register/page.tsx ✅
│   │   ├── eventos/
│   │   │   ├── page.tsx ✅
│   │   │   ├── nuevo/page.tsx ✅
│   │   │   └── [id]/
│   │   │       ├── page.tsx ✅
│   │   │       └── editar/page.tsx ✅
│   │   ├── admin/usuarios/page.tsx ✅
│   │   └── api/
│   │       ├── auth/ ✅
│   │       ├── eventos/ ✅
│   │       └── admin/usuarios/ ✅
│   ├── components/ui/ ✅
│   └── lib/
│       ├── auth.ts ✅
│       ├── database.ts ✅
│       ├── seed.ts ✅
│       └── utils.ts ✅
└── data/ (volumen persistente) ✅
```

### 👥 **Usuarios de Prueba Creados**:
- **Admin**: admin@eventos.com / admin123 (aprobado)
- **Juan**: juan@eventos.com / juan123 (aprobado)
- **María**: maria@eventos.com / maria123 (pendiente)

---

## 📝 NOTAS IMPORTANTES

### 🚨 **Recordatorios**:
- **SIEMPRE usar `-R` mayúscula** para rm
- **Volumen persistente** en `/app/public/uploads`
- **Puerto 3000** por defecto
- **shadcn/ui** para componentes

### 🔧 **Configuraciones**:
- **Next.js 14** con App Router
- **TypeScript** estricto
- **Tailwind CSS** para estilos
- **Docker** para todo el stack

---

## 🎉 OBJETIVO FINAL

**Crear una plataforma web moderna, completamente containerizada, para la gestión de eventos con roles, permisos y almacenamiento persistente.**

**¡Listo para comenzar la implementación!** 🚀
