#!/bin/bash

echo "🔍 DIAGNÓSTICO COMPLETO - Plataforma de Eventos"
echo "==============================================="

# Verificar Docker
echo "🐳 Verificando Docker..."
if docker --version >/dev/null 2>&1; then
    echo "   ✅ Docker: $(docker --version)"
else
    echo "   ❌ Docker no está instalado"
    exit 1
fi

# Verificar Docker Compose
echo "🐳 Verificando Docker Compose..."
if docker-compose --version >/dev/null 2>&1; then
    echo "   ✅ Docker Compose: $(docker-compose --version)"
else
    echo "   ❌ Docker Compose no está instalado"
    exit 1
fi

# Verificar que Docker esté ejecutándose
echo "🔍 Verificando que Docker esté ejecutándose..."
if docker info >/dev/null 2>&1; then
    echo "   ✅ Docker está ejecutándose"
else
    echo "   ❌ Docker no está ejecutándose. Inicia Docker Desktop."
    exit 1
fi

# Verificar archivos del proyecto
echo "📁 Verificando archivos del proyecto..."
files=("Dockerfile" "docker-compose.yml" "package.json" "next.config.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file existe"
    else
        echo "   ❌ $file no existe"
    fi
done

# Verificar contenedores existentes
echo "📦 Contenedores existentes:"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(plataforma-eventos|NAMES)" || echo "   No hay contenedores de la aplicación"

# Verificar puerto 3000
echo "🔌 Verificando puerto 3000..."
if lsof -i :3000 >/dev/null 2>&1; then
    echo "   ⚠️ Puerto 3000 está en uso:"
    lsof -i :3000
else
    echo "   ✅ Puerto 3000 está libre"
fi

# Verificar logs de errores si hay contenedores
if docker ps -a | grep -q "plataforma-eventos"; then
    echo "📋 Logs de errores:"
    docker-compose logs --tail=20 app 2>&1 | grep -i error || echo "   No se encontraron errores en los logs"
    
    echo "📋 Logs completos recientes:"
    docker-compose logs --tail=10 app
fi

echo ""
echo "🌐 URLs de acceso:"
echo "   - Localhost: http://localhost:3000"
echo "   - IP Local: http://10.10.0.73:3000"

echo ""
echo "👥 Usuarios de prueba:"
echo "   - Admin: admin@eventos.com / admin123"
echo "   - Juan: juan@eventos.com / juan123"

