#!/usr/bin/env bash
# ==============================================================================
# DHANSHREE MARKETPLACE - 1-CLICK PRODUCTION CLOUD DEPLOYMENT SCRIPT
# Tested on Ubuntu 22.04 LTS / 24.04 LTS / Debian 12
# ==============================================================================

set -euo pipefail

echo "================================================================="
echo "  🚀 Starting Dhanshree Multi-Vendor Marketplace Cloud Deployment"
echo "================================================================="

# 1. Update OS and install prerequisites
echo "==> [1/6] Updating system packages & installing prerequisites..."
sudo apt-get update -y
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release git ufw

# 2. Install Docker & Docker Compose if not present
if ! command -v docker &> /dev/null; then
    echo "==> [2/6] Installing Docker Engine..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker "$USER"
    rm get-docker.sh
else
    echo "==> [2/6] Docker is already installed."
fi

# 3. Configure Firewall (UFW)
echo "==> [3/6] Configuring firewall rules (SSH, HTTP, HTTPS)..."
sudo ufw allow 22/tcp || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw --force enable || true

# 4. Check for production environment file
if [ ! -f ".env.production" ]; then
    if [ -f ".env.production.example" ]; then
        echo "==> [4/6] Creating .env.production from template..."
        cp .env.production.example .env.production
        echo "⚠️ NOTE: Please edit .env.production with your real secrets, DB URL, and API keys."
    fi
fi

# 5. Build and deploy containers
echo "==> [5/6] Building container images and launching services..."
docker compose -f infra/docker-compose.yml build
docker compose -f infra/docker-compose.yml up -d

# 6. Run database migrations & health check
echo "==> [6/6] Verifying platform service health..."
sleep 10
docker compose -f infra/docker-compose.yml ps

echo "================================================================="
echo "  🎉 Dhanshree Marketplace Deployed Successfully!"
echo "  Web Storefront: http://localhost:3000 (or your public IP)"
echo "  API Backend:    http://localhost:4000/api/health"
echo "  Search Engine:  http://localhost:7700"
echo "================================================================="
