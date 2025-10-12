# 🌐 Configuración de IP - 10.10.0.73

## 📍 IP Configurada
**Tu IP local**: `10.10.0.73`

## 🚀 URLs de Acceso

### Desde tu computadora:
- **Localhost**: http://localhost:3000
- **IP Local**: http://10.10.0.73:3000

### Desde otros dispositivos en la red:
- **Teléfono/Tablet**: http://10.10.0.73:3000
- **Otro computador**: http://10.10.0.73:3000

## 🛠️ Comandos de Inicio

### Ejecutar la aplicación:
```bash
cd /Volumes/TGC/devops/gev/plataforma-eventos
./start.sh
```

### Verificar IPs:
```bash
./get-ip.sh
```

## 👥 Usuarios de Prueba

### 👨‍💼 Administrador
- **Email**: admin@eventos.com
- **Password**: admin123

### 👨‍🏫 Colaborador
- **Email**: juan@eventos.com
- **Password**: juan123

### 👩‍⚕️ Usuario Pendiente
- **Email**: maria@eventos.com
- **Password**: maria123

## 🔧 Solución de Problemas

### Si no puedes acceder por IP:

1. **Verificar que Docker esté ejecutándose**:
   ```bash
   docker-compose ps
   ```

2. **Verificar que el puerto esté abierto**:
   ```bash
   lsof -i :3000
   ```

3. **Verificar logs**:
   ```bash
   docker-compose logs app
   ```

4. **Reconstruir**:
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   ```

## 📱 Prueba de Acceso

1. **Ejecuta** la aplicación en tu Mac
2. **Abre el navegador** en tu teléfono
3. **Ve a**: http://10.10.0.73:3000
4. **Login** con admin@eventos.com / admin123
5. **¡Disfruta la plataforma desde tu móvil!** 📱

