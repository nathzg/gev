#!/bin/bash

echo "🚀 SOLUCIÓN COMPLETA - Plataforma de Eventos"
echo "============================================"

# Verificar Docker
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose. Inicia Docker Desktop primero."
    exit 1
fi

echo "✅ Docker está funcionando"

# Limpiar archivos macOS problemáticos
echo "🧹 Limpiando archivos macOS..."
find . -name "._*" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true

# Parar contenedores existentes
echo "🛑 Parando contenedores existentes..."
docker-compose down -v --remove-orphans 2>/dev/null || true

# Limpiar imágenes
echo "🗑️ Limpiando imágenes..."
docker rmi plataforma-eventos-app 2>/dev/null || true
docker rmi plataforma-eventos_app 2>/dev/null || true

# Limpiar sistema Docker
echo "🧹 Limpiando sistema Docker..."
docker system prune -f

# Liberar puerto 3000
echo "🔌 Liberando puerto 3000..."
if command -v lsof >/dev/null 2>&1; then
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
fi

# Construir aplicación
echo "🔨 Construyendo aplicación..."
docker-compose build --no-cache

# Ejecutar aplicación
echo "🚀 Ejecutando aplicación..."
docker-compose up -d

# Esperar que se inicie
echo "⏳ Esperando que la aplicación se inicie..."
sleep 30

# Verificar estado
echo ""
echo "📊 Estado de contenedores:"
docker-compose ps

echo ""
echo "📋 Logs recientes:"
docker-compose logs --tail=20 app

echo ""
echo "🏥 Verificando salud de la aplicación..."
for i in {1..3}; do
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo "   ✅ Aplicación funcionando correctamente!"
        break
    else
        echo "   ⏳ Intento $i/3 - Esperando que la aplicación responda..."
        sleep 15
    fi
done

if ! curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "   ❌ La aplicación no está respondiendo"
    echo ""
    echo "🔍 Logs de errores:"
    docker-compose logs app | grep -i error || echo "   No se encontraron errores específicos"
fi

echo ""
echo "🌐 URLs de acceso:"
echo "   - Localhost: http://localhost:3000"
echo "   - IP Local: http://10.10.0.73:3000"

echo ""
echo "👥 Usuarios de prueba:"
echo "   - Admin: admin@eventos.com / admin123"
echo "   - Juan: juan@eventos.com / juan123"

echo ""
echo "✅ Proceso completado!"

