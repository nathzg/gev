#!/bin/bash

echo "🚀 Desplegando Plataforma de Eventos..."

# Limpiar archivos macOS
echo "🧹 Limpiando archivos macOS..."
find . -name "._*" -delete
find . -name ".DS_Store" -delete

# Parar contenedores existentes
echo "🛑 Parando contenedores existentes..."
docker-compose down -v

# Limpiar imágenes anteriores
echo "🧹 Limpiando imágenes anteriores..."
docker system prune -f

# Construir imagen
echo "🔨 Construyendo imagen Docker..."
docker-compose build --no-cache

# Ejecutar contenedor
echo "🐳 Ejecutando contenedor..."
docker-compose up -d

# Esperar que se inicie
echo "⏳ Esperando que el contenedor se inicie..."
sleep 20

# Verificar estado
echo "🔍 Verificando estado del contenedor..."
docker-compose ps

# Verificar logs
echo "📋 Últimos logs del contenedor:"
docker-compose logs --tail=20 app

# Verificar salud
echo "🏥 Verificando salud de la aplicación..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Aplicación funcionando correctamente!"
    echo ""
    echo "🌐 URLs de acceso:"
    echo "   - Localhost: http://localhost:3000"
    echo "   - IP Local: http://10.10.0.73:3000"
    echo ""
    echo "👥 Usuarios de prueba:"
    echo "   - Admin: admin@eventos.com / admin123"
    echo "   - Juan: juan@eventos.com / juan123"
    echo "   - María: maria@eventos.com / maria123 (pendiente)"
else
    echo "❌ La aplicación no está respondiendo"
    echo "🔍 Revisa los logs completos:"
    echo "   docker-compose logs app"
fi

