# Rebrand do painel admin (BOVINE)

O painel `/app` é o dashboard do Medusa já compilado. Para não aparecer a marca "Medusa":

```bash
cd apps/backend
npx medusa build
node scripts/brand-admin.js      # SEMPRE depois do build (o build recria .medusa/server/public/admin)
# depois: copie .env para .medusa/server/.env, recrie o link static e reinicie (pm2 restart medusa-backend)
```

O script (`apps/backend/scripts/brand-admin.js`) é idempotente e:
- troca textos "Medusa" -> "BOVINE" nos bundles do admin (todas as línguas; não altera identificadores de código);
- login: "Bem-vindo à BOVINE" / "Entre para acessar o painel";
- título da aba "Painel BOVINE", favicon e apple-touch-icon (arquivos em `scripts/brand-assets/`);
- idioma padrão pt-BR (código `ptBR`) quando o usuário ainda não escolheu outro;
- troca o logo SVG do Medusa no login pelo ícone BOVINE (CSS no index.html);
- renomeia os assets (.js/.css) para forçar atualização no navegador/Cloudflare (são servidos como `immutable`).

O nome exibido na barra lateral vem do nome da loja (Configurações > Loja): "BOVINE Saúde Animal e Agro".
Arquivos de licença (MIT) não são alterados.
