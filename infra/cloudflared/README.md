# Cloudflare Tunnel

O tunnel `bovine.avadesk.com.br` aponta para `http://localhost:7771` (nginx).
Na VPS ele roda como servico com **token** (`/etc/cloudflared/token`) - o token e segredo e NAO fica no repositorio.

Instalar/reinstalar: `cloudflared service install <TOKEN>` (token no painel Cloudflare Zero Trust > Tunnels).