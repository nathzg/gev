#!/bin/bash

echo "🚀 Iniciando Plataforma de Eventos..."

# Limpiar archivos macOS
echo "🧹 Limpiando archivos macOS..."
find . -name "._*" -delete
find . -name ".DS_Store" -delete

# Construir y ejecutar con Docker
echo "🐳 Construyendo y ejecutando con Docker..."
docker-compose up -d --build

# Esperar un momento para que el contenedor se inicie
echo "⏳ Esperando que el contenedor se inicie..."
sleep 15

# Verificar el estado
echo "🔍 Verificando estado del contenedor..."
docker-compose ps

# IP específica del usuario
LOCAL_IP="10.10.0.73"

# Verificar salud
echo "🏥 Verificando salud de la aplicación..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Aplicación funcionando correctamente!"
else
    echo "❌ La aplicación no está respondiendo"
    echo "🔍 Revisa los logs: docker-compose logs app"
fi

echo ""
echo "✅ Proceso completado!"
echo "🌐 URLs de acceso:"
echo "   - Localhost: http://localhost:3000"
echo "   - IP Local: http://$LOCAL_IP:3000"
echo ""
echo "👥 Usuarios de prueba:"
echo "   - Admin: admin@eventos.com / admin123"
echo "   - Juan: juan@eventos.com / juan123"
echo "   - María: maria@eventos.com / maria123 (pendiente)"
echo ""
echo "📱 Puedes acceder desde cualquier dispositivo en la red usando:"
echo "   http://$LOCAL_IP:3000"
