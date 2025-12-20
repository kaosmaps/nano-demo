# Demo Showcase

A stunning portfolio website showcasing KaosMaps demo applications with 21st.dev-inspired animations.

## Features

- **Modern Stack**: React + Vite + TypeScript + Tailwind v4 (OKLCH colors)
- **Smooth Animations**: Framer Motion with card hover effects and staggered entrances
- **Feature Flagging**: Filter demos via URL params (`?client=lawpilots`)
- **Responsive Grid**: Mobile-first design with status indicators
- **Production Ready**: Docker deployment with nginx and Traefik integration

## Demo Inventory

| Demo | Status | Tech Stack |
|------|--------|------------|
| LawPilots | Live | FastAPI, React, PostgreSQL, OpenRouter |
| KaosMaps | Coming Soon | FastAPI, React, Neo4j, pgvector, Pydantic AI |
| Flöter | Coming Soon | FastAPI, React, PostgreSQL |

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Type check
bun run tsc -b
```

## Feature Flags

Filter demos by client using URL parameters:

```
# Show all demos (default)
https://demo.kaosmaps.com/

# Show only LawPilots
https://demo.kaosmaps.com/?client=lawpilots

# Show multiple demos
https://demo.kaosmaps.com/?client=lawpilots,kaosmaps
```

## Deployment

### Prerequisites

1. **Install Kamal** (on your local machine):
   ```bash
   gem install kamal
   ```

2. **Configure secrets**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Docker Hub password/token
   ```

3. **Update configuration** in `config/deploy.yml`:
   - Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username
   - Replace `YOUR_HETZNER_SERVER_IP` with your Hetzner server IP

### Zero-Downtime Deployment with Kamal

Kamal provides zero-downtime deployments by:
1. Building a new Docker image
2. Starting new containers alongside old ones
3. Health checking new containers
4. Gradually routing traffic from old to new containers
5. Stopping old containers only after new ones are healthy

#### Initial Setup (First Deployment)

```bash
# Setup server (installs Docker, configures firewall, etc.)
kamal setup

# This will:
# - Install Docker on your server
# - Set up Docker networks
# - Configure health checks
# - Deploy your application
```

#### Subsequent Deployments

```bash
# Deploy with zero downtime
kamal deploy

# This will:
# - Build new Docker image
# - Push to Docker Hub
# - Pull image on server
# - Start new containers
# - Health check new containers
# - Route traffic to new containers
# - Stop old containers
```

#### Useful Kamal Commands

```bash
# Check deployment status
kamal app details

# View logs
kamal app logs

# Rollback to previous version
kamal rollback

# SSH into server
kamal app exec -i bash

# Restart application
kamal app restart

# Check container health
kamal app containers
```

### GitHub Actions (CI/CD)

Push to `main` branch triggers automated deployment via Kamal.

Required GitHub Actions secrets:
- `KAMAL_REGISTRY_PASSWORD`: Docker Hub token/password
- `SSH_PRIVATE_KEY`: SSH key for server access
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `HETZNER_SERVER_IP`: Your Hetzner server IP address

### Docker Build (Local Testing)

```bash
# Build image
docker build -t demo-showcase .

# Run locally
docker run -p 8080:80 demo-showcase
```

### Legacy Deployment (Traefik + docker-compose)

<details>
<summary>Click to see old deployment method (deprecated)</summary>

1. Clone repo to server:
   ```bash
   ssh server "mkdir -p /opt/kaosmaps/demo/showcase"
   scp docker-compose.yml server:/opt/kaosmaps/demo/showcase/
   ```

2. Manual deploy:
   ```bash
   cd /opt/kaosmaps/demo/showcase
   docker compose pull
   docker compose up -d
   ```

Note: This method has downtime during deployments. Use Kamal instead.
</details>

## Adding New Demos

Edit `src/data/demos.json`:

```json
{
  "id": "my-demo",
  "name": "My Demo",
  "tagline": "Short description",
  "description": "Longer description...",
  "previewImage": "/demos/my-demo-preview.webp",
  "techStack": ["FastAPI", "React"],
  "demoUrl": "/my-demo",
  "status": "live",
  "featured": true,
  "order": 4
}
```

Status options: `live`, `maintenance`, `coming-soon`

## Design

- **Colors**: OKLCH color space (Tailwind v4)
- **Animations**: Spring physics hover, staggered entrance
- **Background**: Animated gradient orbs
- **Typography**: System fonts, clean hierarchy

## License

MIT
