#!/usr/bin/env bash
# Build + restart na VPS. Rode dentro do clone em /opt/medusa-loja.
# Executado automaticamente pelo GitHub Actions (.github/workflows/deploy.yml) a cada push na main.
set -euo pipefail
export PATH=/opt/node22/bin:$PATH
git pull --ff-only
npm ci
cd apps/backend
npx medusa db:migrate
npx medusa build
node scripts/brand-admin.js          # SEMPRE depois do build
cp .env .medusa/server/.env
ln -sfn "$PWD/static" .medusa/server/static
# .medusa/server roda com o node_modules da raiz do monorepo (o build nao gera lockfile proprio).
if [ -f .medusa/server/package-lock.json ]; then (cd .medusa/server && npm ci --omit=dev); fi
cd ../storefront
# O storefront usa React 19, mas a raiz do monorepo hoista React 18 (admin do Medusa) e o
# "next build" quebra (React error #31 no /404). Por isso as deps do storefront sao instaladas
# isoladas, a partir de infra/storefront/package-lock.json (lockfile standalone do storefront).
SF_TMP="$(mktemp -d /opt/.sf-deps.XXXXXX)"
trap 'rm -rf "$SF_TMP"' EXIT
cp package.json "$SF_TMP/"
cp ../../infra/storefront/package-lock.json "$SF_TMP/package-lock.json"
cp ../../.npmrc "$SF_TMP/" 2>/dev/null || true
(cd "$SF_TMP" && npm ci --no-audit --no-fund)
rm -rf node_modules.old
if [ -d node_modules ]; then mv node_modules node_modules.old; fi
mv "$SF_TMP/node_modules" node_modules
rm -rf node_modules.old
npm run build
pm2 restart medusa-backend medusa-storefront
