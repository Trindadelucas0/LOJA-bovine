# Deploy na VPS (BOVINE)

Ambiente: Ubuntu, **Node 22**, PM2, nginx, cloudflared. Dominio: `bovine.avadesk.com.br`.

| Servico | Porta |
|---|---|
| nginx (alvo do tunnel) | 7771 |
| Storefront Next.js | 7772 (127.0.0.1) |
| Backend Medusa + admin `/app` | 9000 |
| PostgreSQL | 5440 |
| Redis | 6382 |

## Primeira instalacao
1. `git clone <repo> /opt/medusa-loja && cd /opt/medusa-loja && npm ci`
2. Crie `apps/backend/.env` e `apps/storefront/.env.local` a partir dos `.env.example` (valores de producao: Postgres 5440, Redis 6382).
3. Backend: `cd apps/backend && npx medusa db:migrate && npx medusa build && node scripts/brand-admin.js`
4. `cp .env .medusa/server/.env` e `ln -sfn $PWD/static .medusa/server/static` (uploads).
5. Storefront: `cd apps/storefront && npm run build`
6. PM2: copie `infra/pm2/ecosystem.config.example.js`, ajuste e `pm2 start ecosystem.config.js && pm2 save`.
7. nginx: copie `infra/nginx/bovine.conf.example` para `/etc/nginx/sites-available/bovine.conf`, linke em `sites-enabled`, `nginx -t && systemctl reload nginx`.
8. cloudflared: ver `infra/cloudflared/README.md`.

## Atualizacoes
`bash scripts/deploy-vps.sh` (inclui o passo obrigatorio do `brand-admin.js` apos o build).

## Backups
- Banco: `pg_dump -p 5440 ...` (dumps nunca entram no git).
- Uploads: `apps/backend/static/`.