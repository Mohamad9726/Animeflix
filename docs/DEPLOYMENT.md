# Animeflix Deployment Guide

## Table of Contents
- [English](#english)
- [Français](#français)

---

## English

### Deployment Overview

Animeflix can be deployed using Docker for containerization or directly on a server with Node.js installed.

### Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Node.js 16+ (for direct deployment)
- Environment variables configured
- SSL certificate (for production HTTPS)

### Docker Deployment

#### 1. Create Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY packages/client/package*.json ./packages/client/

# Install dependencies
RUN npm install --legacy-peer-deps

# Build client
WORKDIR /app/packages/client
RUN npm run build

# Copy application code
WORKDIR /app
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  animeflix:
    build: .
    ports:
      - "${PORT:-3000}:${PORT:-3000}"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - FRONTEND_URL=${FRONTEND_URL}
    restart: unless-stopped
    volumes:
      - ./packages/server/data:/app/packages/server/data
    networks:
      - animeflix-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - animeflix
    networks:
      - animeflix-network

networks:
  animeflix-network:
    driver: bridge
```

#### 3. Create nginx.conf

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    upstream animeflix {
        server animeflix:3000;
    }

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://animeflix;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /socket.io {
            proxy_pass http://animeflix/socket.io;
            proxy_http_version 1.1;
            proxy_buffering off;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

#### 4. Deploy

```bash
# Create .env file with production settings
cat > .env << EOF
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
EOF

# Build and run containers
docker-compose up -d

# View logs
docker-compose logs -f animeflix
```

### Direct Server Deployment

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 2. Clone and Setup

```bash
# Clone repository
git clone <repository-url> /var/www/animeflix
cd /var/www/animeflix

# Install dependencies
npm install

# Create .env file
cat > packages/server/.env << EOF
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
EOF
```

#### 3. Build Application

```bash
# Build both packages
npm run build

# Build client assets
cd packages/client
npm run build
cd ../..
```

#### 4. Start with PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'animeflix-server',
    script: 'packages/server/src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Setup startup script
pm2 startup
pm2 save
```

#### 5. Configure Nginx Reverse Proxy

```bash
# Install nginx
sudo apt install -y nginx

# Create nginx config
sudo tee /etc/nginx/sites-available/animeflix > /dev/null << 'EOF'
upstream animeflix {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://animeflix;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io {
        proxy_pass http://animeflix/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/animeflix /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Verify auto-renewal
sudo systemctl enable certbot.timer
```

### Environment Variables

**Production .env:**

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=info
MAX_CONNECTIONS=1000
```

### Monitoring & Maintenance

#### PM2 Monitoring

```bash
# Monitor in real-time
pm2 monit

# View logs
pm2 logs animeflix-server

# Restart service
pm2 restart animeflix-server
```

#### Docker Health Checks

Add to docker-compose.yml:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

#### Scaling Considerations

- Use Redis for distributed comment storage
- Implement database persistence (MongoDB, PostgreSQL)
- Use load balancer for multiple instances
- Consider CDN for static assets
- Monitor WebSocket connections

### Database Persistence (Optional)

To extend from in-memory storage:

```bash
npm install mongoose redis
```

Configure in server:

```javascript
import mongoose from 'mongoose';
import redis from 'redis';

// MongoDB for comments
mongoose.connect(process.env.MONGODB_URI);

// Redis for real-time data
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
```

---

## Français

### Aperçu du déploiement

Animeflix peut être déployé à l'aide de Docker pour la conteneurisation ou directement sur un serveur avec Node.js installé.

### Prérequis

- Docker et Docker Compose (pour le déploiement conteneurisé)
- Node.js 16+ (pour le déploiement direct)
- Variables d'environnement configurées
- Certificat SSL (pour HTTPS en production)

### Déploiement Docker

#### 1. Créer Dockerfile

Créez `Dockerfile` à la racine du projet:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY packages/client/package*.json ./packages/client/

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Construire le client
WORKDIR /app/packages/client
RUN npm run build

# Copier le code de l'application
WORKDIR /app
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer le serveur
CMD ["npm", "start"]
```

#### 2. Créer docker-compose.yml

```yaml
version: '3.8'

services:
  animeflix:
    build: .
    ports:
      - "${PORT:-3000}:${PORT:-3000}"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - FRONTEND_URL=${FRONTEND_URL}
    restart: unless-stopped
    volumes:
      - ./packages/server/data:/app/packages/server/data
    networks:
      - animeflix-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - animeflix
    networks:
      - animeflix-network

networks:
  animeflix-network:
    driver: bridge
```

#### 3. Créer nginx.conf

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    upstream animeflix {
        server animeflix:3000;
    }

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://animeflix;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /socket.io {
            proxy_pass http://animeflix/socket.io;
            proxy_http_version 1.1;
            proxy_buffering off;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

#### 4. Déployer

```bash
# Créer un fichier .env avec les paramètres de production
cat > .env << EOF
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
EOF

# Construire et exécuter les conteneurs
docker-compose up -d

# Voir les journaux
docker-compose logs -f animeflix
```

### Déploiement direct sur serveur

#### 1. Préparer le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2
```

#### 2. Cloner et configurer

```bash
# Cloner le référentiel
git clone <repository-url> /var/www/animeflix
cd /var/www/animeflix

# Installer les dépendances
npm install

# Créer le fichier .env
cat > packages/server/.env << EOF
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
EOF
```

#### 3. Construire l'application

```bash
# Construire les deux packages
npm run build

# Construire les actifs du client
cd packages/client
npm run build
cd ../..
```

#### 4. Démarrer avec PM2

```bash
# Créer un fichier d'écosystème PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'animeflix-server',
    script: 'packages/server/src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log'
  }]
};
EOF

# Démarrer avec PM2
pm2 start ecosystem.config.js

# Configurer le script de démarrage
pm2 startup
pm2 save
```

#### 5. Configurer le proxy inverse Nginx

```bash
# Installer nginx
sudo apt install -y nginx

# Créer la configuration nginx
sudo tee /etc/nginx/sites-available/animeflix > /dev/null << 'EOF'
upstream animeflix {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://animeflix;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io {
        proxy_pass http://animeflix/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Activer le site
sudo ln -s /etc/nginx/sites-available/animeflix /etc/nginx/sites-enabled/

# Tester et recharger
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Certificat SSL (Let's Encrypt)

```bash
# Installer certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir un certificat
sudo certbot --nginx -d your-domain.com

# Vérifier le renouvellement automatique
sudo systemctl enable certbot.timer
```

### Variables d'environnement

**Production .env:**

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=info
MAX_CONNECTIONS=1000
```

### Surveillance et maintenance

#### Surveillance PM2

```bash
# Surveiller en temps réel
pm2 monit

# Afficher les journaux
pm2 logs animeflix-server

# Redémarrer le service
pm2 restart animeflix-server
```

#### Vérifications de santé Docker

Ajouter à docker-compose.yml:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

#### Considérations de mise à l'échelle

- Utiliser Redis pour le stockage des commentaires distribués
- Implémenter la persistance de la base de données (MongoDB, PostgreSQL)
- Utiliser un équilibreur de charge pour plusieurs instances
- Considérer un CDN pour les actifs statiques
- Surveiller les connexions WebSocket
