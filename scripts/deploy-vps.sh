#!/usr/bin/env bash
# Build + restart na VPS. Rode dentro do clone em /opt/medusa-loja.
# Executado automaticamente pelo GitHub Actions (.github/workflows/deploy.yml) a cada push na main.
set -euo pipefail
git pull --ff-only
npm ci
cd apps/backend
npx medusa db:migrate
npx medusa build
node scripts/brand-admin.js          # SEMPRE depois do build
cp .env .medusa/server/.env
ln -sfn "$PWD/static" .medusa/server/static
(cd .medusa/server && npm ci --omit=dev)
cd ../storefront
npm run build
pm2 restart medusa-backend medusa-storefront