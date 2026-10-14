# BOVINE - Loja virtual (Saúde Animal e Agro)

Loja e-commerce da **BOVINE**, construída sobre o [Medusa](https://medusajs.com) v2 (backend + admin) e o Next.js Starter do Medusa (storefront), adaptada para o Brasil: pt-BR, BRL, CEP/CPF, PIX, frete PAC/SEDEX, área do cliente, PWA e painel admin com a marca BOVINE.

Produção: https://bovine.avadesk.com.br

## Stack
- **Backend:** Medusa 2.21 (Node 22, TypeScript), PostgreSQL, Redis, módulo próprio `store-content`
- **Storefront:** Next.js 15 + React 19 + Tailwind (design system AVADESK)
- **Monorepo:** npm workspaces + Turborepo
- **Infra:** VPS com PM2, nginx e Cloudflare Tunnel

## Estrutura
```
apps/backend      Medusa (API, admin /app, módulos, scripts/brand-admin.js)
apps/storefront   Loja Next.js
docs/             Manual da loja (PDF), BRAND-ADMIN.md, DEPLOY.md, guias
infra/            Exemplos: pm2, nginx, cloudflared, env
scripts/          Imagens de seed e script de deploy
```

## Rodando localmente
Pré-requisitos: Node >= 22, PostgreSQL e Redis.
```bash
npm install
cp apps/backend/.env.example apps/backend/.env            # preencha
cp apps/storefront/.env.example apps/storefront/.env.local
cd apps/backend && npx medusa db:migrate && npx medusa user -e admin@exemplo.com -p <senha>
cd ../.. && npm run dev
```
- Backend/admin: http://localhost:9000/app
- Loja: http://localhost:8000

## Deploy na VPS
Resumo (detalhes em [docs/DEPLOY.md](docs/DEPLOY.md)):
- Node 22, PM2 (`medusa-backend` na porta **9000**, `medusa-storefront` na **7772**)
- nginx na **7771** (`infra/nginx/bovine.conf.example`) roteia `/app`, `/admin`, `/auth`, `/store`, `/static`, `/hooks`, `/health` para o backend e o resto para a loja
- cloudflared tunnel `bovine.avadesk.com.br` -> `localhost:7771`
- PostgreSQL na **5440**, Redis na **6382**

### Passo obrigatório após cada build do backend
```bash
cd apps/backend && npx medusa build && node scripts/brand-admin.js
```
O build recria o admin com a marca Medusa; o `brand-admin.js` reaplica a marca BOVINE. Ver [docs/BRAND-ADMIN.md](docs/BRAND-ADMIN.md).

## Segurança
Nenhum segredo é versionado: `.env*` (exceto `.env.example`/`.env.template`), dumps, logs, `*.bak*`, uploads (`apps/backend/static/`) e builds estão no `.gitignore`.

## Créditos e licenças
- [Medusa](https://github.com/medusajs/medusa) e o Next.js Starter - licença **MIT** (© Medusa). Ver [LICENSE](LICENSE). Os arquivos de licença originais são mantidos.
- Personalizações BOVINE/AVADESK: código próprio deste repositório.