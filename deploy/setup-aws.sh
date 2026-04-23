#!/bin/bash
set -e

echo "============================================================="
echo "  Setup API Mock ePayco - AWS EC2"
echo "============================================================="

SERVER_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || curl -s ifconfig.me)
echo "  IP publica: $SERVER_IP"
echo ""

echo "[1/5] Actualizando sistema..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "[2/5] Instalando Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
echo "  Node.js: $(node --version)"

echo "[3/5] Instalando PM2..."
sudo npm install -g pm2

APP_DIR="$HOME/api-mock"
cd "$APP_DIR"

if [ ! -f "package.json" ]; then
    echo ""
    echo "  ERROR: Sube los archivos primero con upload-aws.ps1"
    exit 1
fi

echo "[4/5] Instalando dependencias..."
npm install

echo "[5/5] Configurando firewall..."
sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT 2>/dev/null || true
if command -v ufw &>/dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 3000/tcp
    sudo ufw --force enable
fi

echo ""
echo "Iniciando API con PM2..."
pm2 stop api-mock 2>/dev/null || true
pm2 delete api-mock 2>/dev/null || true
pm2 start app.js --name api-mock
pm2 save
STARTUP_CMD=$(pm2 startup | grep "sudo" | head -1)
if [ -n "$STARTUP_CMD" ]; then
    eval "$STARTUP_CMD" 2>/dev/null || true
fi

echo ""
echo "============================================================="
echo "  DEPLOY COMPLETADO"
echo "============================================================="
echo ""
echo "  URL: http://$SERVER_IP:3000"
echo ""
echo "  Endpoints:"
echo "    Sin auth:   /no-auth/confirmacion"
echo "    Basic Auth: /basic/confirmacion  (login: /basic/login)"
echo "    JWT:        /jwt/confirmacion    (login: /jwt/login)"
echo ""
echo "  Ver todo: curl http://$SERVER_IP:3000/"
echo "  Logs:     pm2 logs api-mock"
echo ""
echo "============================================================="
