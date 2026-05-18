# nano-demo

**Last Updated**: 2026-05-18

> **🗑 DECOMMISSIONED 2026-05-18**: the `kaosmaps-demo-001` Hetzner server
> backing this demo was destroyed during the nano-infra VPS fleet cleanup
> (PR #162). The `.github/workflows/deploy.yml` workflow was removed in this
> same PR — there is no automated deploy target anymore. This repo and its
> docker-compose / Dockerfile content are preserved so the demo can be
> re-deployed to a new host or migrated to the nano-infra k3s cluster when
> needed. The server-access block below is retained as historical reference.

## 🗄️ HISTORICAL: Demo server (decommissioned)

| Property | Value (historical) |
|----------|--------------------|
| **IP Address** | `46.224.195.69` *(destroyed)* |
| **Server Name** | `kaosmaps-demo-001` *(destroyed)* |
| **SSH Key** | `~/.ssh/kaosmaps-demo-deploy` |
| **SSH User** | `root` |
| **Traefik Config** | `/opt/traefik/docker-compose.yml` |

### Quick SSH Commands

```bash
# Connect to demo server (CORRECT WAY)
ssh -i ~/.ssh/kaosmaps-demo-deploy root@46.224.195.69

# Check ALL containers
ssh -i ~/.ssh/kaosmaps-demo-deploy root@46.224.195.69 'docker ps -a'

# Check Traefik routing
ssh -i ~/.ssh/kaosmaps-demo-deploy root@46.224.195.69 'docker logs traefik --tail 100'

# Restart Traefik after config changes
ssh -i ~/.ssh/kaosmaps-demo-deploy root@46.224.195.69 'cd /opt/traefik && docker compose restart'
```

## 📂 Server Paths

| App | Demo Path | Prod Path |
|-----|-----------|-----------|
| lawpilots | `/opt/kaosmaps/demo/lawpilots` | `/opt/lawpilots` |
| hauck | `/opt/apps/hauck` | - |
| showcase | `/opt/kaosmaps/demo/showcase` | - |

## 🔐 Basic Auth Credentials

| App | Demo Auth | Prod Auth |
|-----|-----------|-----------|
| lawpilots | `demo:Demo.lawpilots.2025` | `lawpilots:KaosMaps!!lawpilots#demo` |
| hauck | `demo:Demo.hauck.2025` | - |

## 🌐 URLs

| App | Demo URL | Prod URL |
|-----|----------|----------|
| showcase | `https://demo.kaosmaps.com/` | - |
| lawpilots | `https://demo.kaosmaps.com/lawpilots/` | `https://lawpilots.kaosmaps.com/` |
| hauck | `https://demo.kaosmaps.com/hauck/` | - |

## ⚠️ KNOWN ISSUES

1. **Double Basic Auth Layer** - Traefik + app-level auth can conflict
2. **Path-based routing** - Demo uses `/appname/` prefix, prod uses subdomain
3. **StripPrefix middleware** - Must match between API and Web containers

## 🏷️ TRAEFIK LABEL STANDARDS

**Traefik uses Docker provider** - all routing via container labels.

**IMPORTANT: Use `websecure` NOT `https` for entrypoints!**

### Standard Web Container Labels
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=kaosmaps-demo"
  - "traefik.http.routers.APPNAME-web.rule=Host(`demo.kaosmaps.com`) && PathPrefix(`/APPNAME`)"
  - "traefik.http.routers.APPNAME-web.entrypoints=websecure"
  - "traefik.http.routers.APPNAME-web.tls=true"
  - "traefik.http.routers.APPNAME-web.tls.certresolver=letsencrypt"
  - "traefik.http.routers.APPNAME-web.middlewares=APPNAME-web-strip,APPNAME-auth"
  - "traefik.http.middlewares.APPNAME-web-strip.stripprefix.prefixes=/APPNAME"
  - "traefik.http.middlewares.APPNAME-auth.basicauth.users=demo:{SHA}Cf9pX4wtFsmRAsfu1tdLfTX7eJ0="
  - "traefik.http.services.APPNAME-web.loadbalancer.server.port=80"
```

### Standard API Container Labels
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=kaosmaps-demo"
  - "traefik.http.routers.APPNAME-api.rule=Host(`demo.kaosmaps.com`) && PathPrefix(`/APPNAME/api`)"
  - "traefik.http.routers.APPNAME-api.entrypoints=websecure"
  - "traefik.http.routers.APPNAME-api.tls=true"
  - "traefik.http.routers.APPNAME-api.tls.certresolver=letsencrypt"
  - "traefik.http.routers.APPNAME-api.priority=100"
  - "traefik.http.routers.APPNAME-api.middlewares=APPNAME-api-strip,APPNAME-auth"
  - "traefik.http.middlewares.APPNAME-api-strip.stripprefix.prefixes=/APPNAME/api"
  - "traefik.http.services.APPNAME-api.loadbalancer.server.port=8000"
```

## 🔧 Debugging Commands

```bash
# Full Traefik debug
ssh -i ~/.ssh/kaosmaps-demo-deploy root@46.224.195.69 'docker logs traefik 2>&1 | grep -i error | tail -20'

# Check if container is in correct network
ssh -i ~/.ssh/kaosmaps-demo-deploy root@46.224.195.69 'docker network inspect kaosmaps-demo'

# Restart specific app
ssh -i ~/.ssh/kaosmaps-demo-deploy root@46.224.195.69 'cd /opt/kaosmaps/demo/lawpilots && docker compose restart'

# Full redeploy
ssh -i ~/.ssh/kaosmaps-demo-deploy root@46.224.195.69 'cd /opt/kaosmaps/demo/lawpilots && docker compose pull && docker compose up -d'
```
