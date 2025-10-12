#!/bin/bash

echo "🌐 IPs de acceso configuradas..."

# IP específica del usuario
LOCAL_IP="10.10.0.73"

echo "📍 IPs de acceso disponibles:"
echo "   - Localhost: http://localhost:3000"
echo "   - IP Local: http://$LOCAL_IP:3000"

# Verificar si Docker está ejecutándose
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Docker está ejecutándose"
    echo "🌐 Puedes acceder desde cualquier dispositivo en la red usando:"
    echo "   http://$LOCAL_IP:3000"
    echo ""
    echo "📱 Ejemplo de acceso desde teléfono/tablet:"
    echo "   http://10.10.0.73:3000"
else
    echo ""
    echo "❌ Docker no está ejecutándose"
    echo "🚀 Ejecuta: docker-compose up -d --build"
fi
