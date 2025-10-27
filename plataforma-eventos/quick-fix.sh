#!/bin/bash

echo "🔧 Solución Rápida - Plataforma de Eventos"
echo "=========================================="

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose. Inicia Docker Desktop primero."
    exit 1
fi

echo "✅ Docker está ejecutándose"

# Limpiar archivos macOS problemáticos
echo "🧹 Limpiando archivos macOS..."
find . -name "._*" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true

# Parar contenedores existentes
echo "🛑 Parando contenedores existentes..."
docker-compose down -v 2>/dev/null || true

# Limpiar imágenes
echo "🗑️ Limpiando imágenes..."
docker rmi plataforma-eventos-app 2>/dev/null || true
docker rmi plataforma-eventos_app 2>/dev/null || true

# Liberar puerto 3000
echo "🔌 Liberando puerto 3000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

# Construir y ejecutar
echo "🔨 Construyendo aplicación..."
docker-compose build --no-cache

echo "🚀 Ejecutando aplicación..."
docker-compose up -d

# Esperar que se inicie
echo "⏳ Esperando que la aplicación se inicie..."
sleep 20

# Verificar estado
echo "📊 Estado de contenedores:"
docker-compose ps

echo ""
echo "📋 Logs recientes:"
docker-compose logs --tail=20 app

echo ""
echo "🌐 URLs de acceso:"
echo "   - Localhost: http://localhost:3000"
echo "   - IP Local: http://10.10.0.73:3000"

echo ""
echo "👥 Usuarios de prueba:"
echo "   - Admin: admin@eventos.com / admin123"
echo "   - Juan: juan@eventos.com / juan123"

