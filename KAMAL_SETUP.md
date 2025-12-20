# Kamal Zero-Downtime Deployment Setup Guide

This guide walks you through setting up Kamal for zero-downtime deployments of the demo-showcase application.

## What is Kamal?

Kamal is a deployment tool created by 37signals that enables zero-downtime Docker deployments. It works with any Dockerized application, not just Rails. While 37signals employs DHH (creator of Ruby on Rails) and some Rails contributors, Rails itself is maintained by Rails Core, a team distributed across multiple companies.

### How Zero-Downtime Works

1. **Build Phase**: Kamal builds your new Docker image locally or on the server
2. **Push Phase**: Image is pushed to Docker registry (Docker Hub)
3. **Deploy Phase**:
   - New container starts alongside the old one
   - Health checks verify the new container is ready
   - Traffic gradually shifts from old → new container
   - Old container stops only after new one is healthy
4. **No Downtime**: Users never experience service interruption

## Prerequisites

### 1. Install Kamal Locally

```bash
# Install Ruby (if not already installed)
# On macOS:
brew install ruby

# On Ubuntu/Debian:
sudo apt install ruby-full

# Install Kamal gem
gem install kamal

# Verify installation
kamal version
```

### 2. Docker Hub Account

You need a Docker Hub account to store your images:

1. Create account at https://hub.docker.com/
2. Create an access token:
   - Go to Account Settings → Security → Access Tokens
   - Click "New Access Token"
   - Name: "kamal-deploy"
   - Permissions: Read, Write, Delete
   - Copy the token (you'll need it later)

### 3. Server Requirements

Your Hetzner server needs:
- Ubuntu 20.04+ (or any Linux with Docker support)
- SSH access with root or sudo user
- Port 22 (SSH) open
- Ports 80, 443 open (for HTTP/HTTPS)
- Existing Traefik setup (if using external proxy)

## Configuration

### 1. Configure Deployment Settings

Edit `config/deploy.yml` and replace placeholders:

```yaml
# Replace this:
image: YOUR_DOCKERHUB_USERNAME/demo-showcase

# With your Docker Hub username:
image: johndoe/demo-showcase

# Replace this:
servers:
  web:
    hosts:
      - YOUR_HETZNER_SERVER_IP

# With your server IP:
servers:
  web:
    hosts:
      - 123.456.789.012
```

### 2. Set Up Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your Docker Hub token
# .env file:
KAMAL_REGISTRY_PASSWORD=dckr_pat_YOUR_TOKEN_HERE
```

**Important**: Never commit `.env` to git (it's already in `.gitignore`)

### 3. Configure SSH Access

Kamal uses SSH to connect to your server. Ensure you have SSH key access:

```bash
# Test SSH connection
ssh root@YOUR_SERVER_IP

# If you can connect without password, you're good!
```

If you need to set up SSH keys:

```bash
# Generate key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy to server
ssh-copy-id root@YOUR_SERVER_IP
```

## Initial Deployment

### 1. Setup Command (First Time Only)

```bash
# This sets up the server and deploys
kamal setup
```

What `kamal setup` does:
- Installs Docker on the server (if not present)
- Creates Docker networks
- Sets up kamal-proxy or uses your existing Traefik
- Builds and deploys your application
- Configures health checks

### 2. Verify Deployment

```bash
# Check app status
kamal app details

# View logs
kamal app logs --lines 100

# Check running containers
kamal app containers
```

Visit your application: https://demo.kaosmaps.com/

## Subsequent Deployments

After the initial setup, deployments are simple:

```bash
# Deploy with zero downtime
kamal deploy
```

This will:
1. Build new Docker image
2. Push to Docker Hub
3. Pull on server
4. Start new container (old keeps running)
5. Health check new container
6. Route traffic to new container
7. Stop old container

**Zero downtime achieved!**

## GitHub Actions (CI/CD)

### Required Secrets

Go to GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `KAMAL_REGISTRY_PASSWORD` | Docker Hub access token | `dckr_pat_abc123...` |
| `SSH_PRIVATE_KEY` | Private SSH key for server | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `DOCKERHUB_USERNAME` | Your Docker Hub username | `johndoe` |
| `HETZNER_SERVER_IP` | Server IP address | `123.456.789.012` |

### How to Get SSH Private Key

```bash
# Display your private key
cat ~/.ssh/id_ed25519

# Copy the entire output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... key content ...
# -----END OPENSSH PRIVATE KEY-----
```

Paste this entire content into the `SSH_PRIVATE_KEY` secret.

### Automated Deployments

Once secrets are configured:

1. Push code to `main` branch
2. GitHub Actions automatically runs
3. Kamal deploys with zero downtime
4. Check workflow status in Actions tab

## Useful Commands

### Monitoring

```bash
# View live logs
kamal app logs --follow

# Check container details
kamal app details

# List all containers
kamal app containers

# Check server Docker status
kamal app exec "docker ps"
```

### Management

```bash
# Restart application
kamal app restart

# Rollback to previous version
kamal rollback

# Stop application
kamal app stop

# Start application
kamal app start

# Remove application completely
kamal app remove
```

### SSH Access

```bash
# SSH into running container
kamal app exec -i bash

# SSH into server
kamal app exec --reuse "bash"

# Run command on server
kamal app exec "ls -la /opt"
```

### Troubleshooting

```bash
# View last 500 log lines
kamal app logs --lines 500

# Check health check status
kamal app exec "wget -O- http://localhost/health"

# Inspect container
kamal app exec "docker inspect demo-showcase"

# Check Docker network
kamal app exec "docker network ls"
kamal app exec "docker network inspect kaosmaps-demo"
```

## Integration with Traefik

This configuration works alongside your existing Traefik setup:

```yaml
# In config/deploy.yml:
proxy:
  type: none  # Uses external Traefik

# Docker labels configure Traefik routing:
labels:
  traefik.enable: true
  traefik.http.routers.showcase.rule: Host(`demo.kaosmaps.com`)
  traefik.http.routers.showcase.entrypoints: websecure
  # ... etc
```

Kamal will:
- Start containers with proper Traefik labels
- Connect to your `kaosmaps-demo` network
- Let Traefik handle SSL/TLS and routing
- Perform zero-downtime container swaps

## Rollback Strategy

If a deployment has issues:

```bash
# Instant rollback to previous version
kamal rollback
```

Kamal keeps the last 3 container versions (configurable via `retain_containers` in `deploy.yml`).

## Volume Persistence

The `apps.json` file is mounted as a volume:

```yaml
volumes:
  - /opt/kaosmaps/demo/showcase/apps.json:/usr/share/nginx/html/apps.json:ro
```

This file persists across deployments and container restarts.

## Advanced Configuration

### Building on Server (Instead of Locally)

Edit `config/deploy.yml`:

```yaml
builder:
  # Comment out local builder
  # local:
  #   enabled: true

  # Enable remote builder
  remote:
    arch: amd64
```

This builds Docker images on the server instead of your machine (useful for slow internet).

### Using kamal-proxy Instead of Traefik

If you want to use Kamal's built-in proxy:

```yaml
proxy:
  type: kamal  # Use kamal-proxy
  host: demo.kaosmaps.com
  ssl: true
```

Then remove Traefik-specific labels.

## Comparison: Old vs New Deployment

### Old Method (docker-compose)

```bash
docker compose down        # ❌ DOWNTIME STARTS
docker compose pull
docker compose build
docker compose up -d       # ✅ Service restored
```

**Downtime**: ~30-60 seconds

### Kamal Method

```bash
kamal deploy              # ✅ Zero downtime
```

**Downtime**: 0 seconds (seamless transition)

## Next Steps

1. Complete configuration (replace placeholders)
2. Set up environment variables (`.env`)
3. Configure GitHub Actions secrets
4. Run `kamal setup` for initial deployment
5. Test by pushing to `main` branch

## Support

- **Kamal Docs**: https://kamal-deploy.org/docs/
- **GitHub**: https://github.com/basecamp/kamal
- **Community**: https://discord.gg/YgHVT7GCXS

## Troubleshooting Common Issues

### "Permission denied" during deployment

Ensure your SSH key has access to the server:

```bash
ssh-copy-id root@YOUR_SERVER_IP
```

### "Registry authentication failed"

Check your Docker Hub token in `.env`:

```bash
# Test Docker Hub login
echo $KAMAL_REGISTRY_PASSWORD | docker login -u YOUR_USERNAME --password-stdin
```

### "Health check failed"

Check if your app is responding on `/health`:

```bash
kamal app exec "wget -O- http://localhost/health"
```

### "Network not found: kaosmaps-demo"

Create the Docker network:

```bash
kamal app exec "docker network create kaosmaps-demo"
```
