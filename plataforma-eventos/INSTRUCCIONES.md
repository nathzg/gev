# 🚀 INSTRUCCIONES DE INSTALACIÓN Y EJECUCIÓN

## 📋 Prerrequisitos
- Docker y Docker Compose instalados
- Terminal/Command Prompt

## 🛠️ Instalación

### Paso 1: Navegar al directorio
```bash
cd /Volumes/TGC/devops/gev/plataforma-eventos
```

### Paso 2: Limpiar archivos macOS (si es necesario)
```bash
find . -name "._*" -delete && find . -name ".DS_Store" -delete
```

### Paso 3: Ejecutar (Opción A - Script Automático)
```bash
./deploy.sh
```

### Paso 3: Ejecutar (Opción B - Manual)
```bash
docker-compose down -v
docker-compose up -d --build
```

### Paso 4: Verificar estado
```bash
./status.sh
```

### Paso 5: Verificar salud
```bash
curl -f http://localhost:3000
```

## 🌐 Acceso a la Aplicación

### 📍 URLs de Acceso:
- **Localhost**: http://localhost:3000
- **IP Local**: http://10.10.0.73:3000
- **Puerto**: 3000

### 📱 Acceso desde Otros Dispositivos:
Una vez que la aplicación esté ejecutándose, puedes acceder desde cualquier dispositivo en la misma red usando:
```
http://10.10.0.73:3000
```

### 🔍 Verificar IPs:
```bash
# Usar el script incluido
./get-ip.sh
```

## 👥 Usuarios de Prueba

### 👨‍💼 Administrador
- **Email**: admin@eventos.com
- **Password**: admin123
- **Permisos**: Gestión completa

### 👨‍🏫 Colaborador
- **Email**: juan@eventos.com
- **Password**: juan123
- **Permisos**: Crear y gestionar sus eventos

### 👩‍⚕️ Usuario Pendiente
- **Email**: maria@eventos.com
- **Password**: maria123
- **Estado**: Pendiente de aprobación

## 🔧 Comandos Útiles

### Ver logs
```bash
docker-compose logs -f
```

### Parar servicios
```bash
docker-compose down
```

### Parar y eliminar volúmenes
```bash
docker-compose down -v
```

### Reconstruir imagen
```bash
docker-compose up -d --build
```

## 🚨 Solución de Problemas

### Si no puedes acceder a localhost:3000:

1. **Diagnóstico completo**:
   ```bash
   ./debug.sh
   ```

2. **Limpieza completa y despliegue**:
   ```bash
   ./clean-deploy.sh
   ```

3. **Verificar estado**:
   ```bash
   ./status.sh
   ```

4. **Ver logs de errores**:
   ```bash
   docker-compose logs app
   ```

5. **Verificar contenedores**:
   ```bash
   docker ps -a
   ```

### Errores Comunes:

#### Error: "Port already in use"
```bash
# Liberar puerto 3000
lsof -ti :3000 | xargs kill -9
```

#### Error: "Container failed to start"
```bash
# Limpieza completa
./clean-deploy.sh
```

#### Error: "Build failed"
```bash
# Reconstruir sin cache
docker-compose build --no-cache
```

### Si hay errores de build:

1. **Limpiar archivos macOS**:
   ```bash
   find . -name "._*" -delete && find . -name ".DS_Store" -delete
   ```

2. **Limpiar cache de Docker**:
   ```bash
   docker system prune -f
   ```

3. **Reconstruir sin cache**:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 📊 Estructura de Datos

Los datos se almacenan en volúmenes Docker:
- **Usuarios y eventos**: `/app/data/` (volumen `app_data`)
- **Archivos subidos**: `/app/public/uploads/` (volumen `uploads_data`)

## 🎯 Funcionalidades Disponibles

### ✅ Implementadas
- Login/Registro de usuarios
- CRUD completo de eventos
- Gestión de roles y permisos
- Panel de administración
- Finalización de eventos
- Gestión de contactos y autoridades

### 🚧 Próximas
- Subida de archivos
- Filtros y búsqueda
- Notificaciones
- Reportes

## 📞 Soporte

Si tienes problemas, verifica:
1. Docker está ejecutándose
2. El puerto 3000 está libre
3. Los logs no muestran errores
4. Los volúmenes están montados correctamente
