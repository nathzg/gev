#!/bin/bash

echo "🔍 Diagnóstico de la Plataforma de Eventos"
echo "=========================================="

# Verificar Docker
echo "🐳 Verificando Docker..."
if docker --version > /dev/null 2>&1; then
    echo "   ✅ Docker está instalado: $(docker --version)"
else
    echo "   ❌ Docker no está instalado"
    exit 1
fi

# Verificar Docker Compose
echo ""
echo "🐳 Verificando Docker Compose..."
if docker-compose --version > /dev/null 2>&1; then
    echo "   ✅ Docker Compose está instalado: $(docker-compose --version)"
else
    echo "   ❌ Docker Compose no está instalado"
    exit 1
fi

# Verificar archivos
echo ""
echo "📁 Verificando archivos..."
if [ -f "Dockerfile" ]; then
    echo "   ✅ Dockerfile existe"
else
    echo "   ❌ Dockerfile no existe"
fi

if [ -f "docker-compose.yml" ]; then
    echo "   ✅ docker-compose.yml existe"
else
    echo "   ❌ docker-compose.yml no existe"
fi

if [ -f "package.json" ]; then
    echo "   ✅ package.json existe"
else
    echo "   ❌ package.json no existe"
fi

# Verificar contenedores
echo ""
echo "📦 Estado de contenedores:"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Verificar si hay contenedores de la app
echo ""
echo "🔍 Contenedores de la aplicación:"
if docker ps -a | grep -q "plataforma-eventos"; then
    echo "   ✅ Contenedores de la aplicación encontrados"
    
    # Mostrar logs de errores
    echo ""
    echo "📋 Logs de errores:"
    docker-compose logs --tail=50 app 2>&1 | grep -i error || echo "   No se encontraron errores en los logs"
    
    # Mostrar logs completos recientes
    echo ""
    echo "📋 Logs completos recientes:"
    docker-compose logs --tail=20 app
else
    echo "   ❌ No se encontraron contenedores de la aplicación"
fi

# Verificar puertos
echo ""
echo "🔌 Verificando puertos:"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "   ✅ Puerto 3000 está en uso"
    lsof -i :3000
else
    echo "   ❌ Puerto 3000 no está en uso"
fi

# Verificar salud de la aplicación
echo ""
echo "🏥 Verificando salud de la aplicación:"
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Aplicación respondiendo en localhost:3000"
else
    echo "   ❌ Aplicación no responde en localhost:3000"
fi

if curl -f http://10.10.0.73:3000 > /dev/null 2>&1; then
    echo "   ✅ Aplicación respondiendo en 10.10.0.73:3000"
else
    echo "   ❌ Aplicación no responde en 10.10.0.73:3000"
fi

echo ""
echo "🌐 URLs de acceso:"
echo "   - Localhost: http://localhost:3000"
echo "   - IP Local: http://10.10.0.73:3000"

