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

### Docker Build

```bash
# Build image
docker build -t demo-showcase .

# Run locally
docker run -p 8080:80 demo-showcase
```

### Production (Traefik)

1. Clone repo to server:
   ```bash
   ssh server "mkdir -p /opt/kaosmaps/demo/showcase"
   scp docker-compose.yml server:/opt/kaosmaps/demo/showcase/
   ```

2. Configure GitHub Actions secrets:
   - `DEPLOY_HOST`: Server hostname
   - `DEPLOY_USER`: SSH username
   - `DEPLOY_KEY`: SSH private key

3. Push to `main` branch - CI/CD handles the rest

### Manual Deploy

```bash
cd /opt/kaosmaps/demo/showcase
docker compose pull
docker compose up -d
```

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
