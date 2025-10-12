#!/bin/bash

echo "🧹 Limpieza Completa y Despliegue"
echo "================================="

# Limpiar archivos macOS
echo "🧹 Limpiando archivos macOS..."
find . -name "._*" -delete
find . -name ".DS_Store" -delete

# Parar y eliminar contenedores
echo "🛑 Parando y eliminando contenedores..."
docker-compose down -v --remove-orphans

# Eliminar imágenes
echo "🗑️ Eliminando imágenes..."
docker rmi plataforma-eventos-app 2>/dev/null || true
docker rmi plataforma-eventos_app 2>/dev/null || true

# Limpiar sistema Docker
echo "🧹 Limpiando sistema Docker..."
docker system prune -f

# Verificar que el puerto esté libre
echo "🔌 Verificando puerto 3000..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "   ⚠️ Puerto 3000 está en uso, intentando liberarlo..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
fi

# Construir imagen desde cero
echo "🔨 Construyendo imagen desde cero..."
docker-compose build --no-cache --pull

# Ejecutar contenedor
echo "🐳 Ejecutando contenedor..."
docker-compose up -d

# Esperar que se inicie
echo "⏳ Esperando que el contenedor se inicie..."
sleep 30

# Verificar estado
echo "🔍 Verificando estado del contenedor..."
docker-compose ps

# Verificar logs
echo "📋 Logs del contenedor:"
docker-compose logs --tail=30 app

# Verificar salud
echo "🏥 Verificando salud de la aplicación..."
for i in {1..5}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "   ✅ Aplicación funcionando correctamente!"
        break
    else
        echo "   ⏳ Intento $i/5 - Esperando que la aplicación responda..."
        sleep 10
    fi
done

if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "   ❌ La aplicación no está respondiendo"
    echo "   🔍 Revisa los logs completos:"
    echo "      docker-compose logs app"
fi

echo ""
echo "✅ Proceso de limpieza y despliegue completado!"
echo "🌐 URLs de acceso:"
echo "   - Localhost: http://localhost:3000"
echo "   - IP Local: http://10.10.0.73:3000"
echo ""
echo "👥 Usuarios de prueba:"
echo "   - Admin: admin@eventos.com / admin123"
echo "   - Juan: juan@eventos.com / juan123"
echo "   - María: maria@eventos.com / maria123 (pendiente)"

