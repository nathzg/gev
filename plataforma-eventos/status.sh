#!/bin/bash

echo "🔍 Estado de la Plataforma de Eventos"
echo "======================================"

# Verificar Docker
echo "🐳 Estado de Docker:"
if docker --version > /dev/null 2>&1; then
    echo "   ✅ Docker está instalado"
else
    echo "   ❌ Docker no está instalado"
    exit 1
fi

# Verificar contenedores
echo ""
echo "📦 Contenedores:"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Verificar si la app está ejecutándose
echo ""
echo "🌐 Estado de la aplicación:"
if docker-compose ps | grep -q "Up"; then
    echo "   ✅ Aplicación ejecutándose"
    
    # Verificar puerto
    if lsof -i :3000 > /dev/null 2>&1; then
        echo "   ✅ Puerto 3000 abierto"
    else
        echo "   ❌ Puerto 3000 no está abierto"
    fi
    
    # Verificar salud
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "   ✅ Aplicación respondiendo"
    else
        echo "   ❌ Aplicación no responde"
    fi
else
    echo "   ❌ Aplicación no está ejecutándose"
fi

# Mostrar IPs de acceso
echo ""
echo "🌐 URLs de acceso:"
echo "   - Localhost: http://localhost:3000"
echo "   - IP Local: http://10.10.0.73:3000"

# Mostrar logs recientes si hay problemas
if ! docker-compose ps | grep -q "Up"; then
    echo ""
    echo "📋 Logs recientes:"
    docker-compose logs --tail=10 app
fi

