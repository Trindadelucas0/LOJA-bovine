// Exemplo de PM2 para a VPS. Copie para ecosystem.config.js e ajuste os caminhos.
// Segredos ficam nos arquivos .env de cada app, nunca aqui.
module.exports = {
  apps: [
    {
      name: "medusa-backend",
      cwd: "/opt/medusa-loja/apps/backend/.medusa/server",
      script: "/opt/medusa-loja/node_modules/.bin/medusa",
      args: "start",
      env: { NODE_ENV: "production", PORT: "9000" },
    },
    {
      name: "medusa-storefront",
      cwd: "/opt/medusa-loja/apps/storefront",
      script: "node_modules/.bin/next",
      args: "start -p 7772 -H 127.0.0.1",
      env: { NODE_ENV: "production" },
    },
  ],
}