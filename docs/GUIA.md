# Guia da loja Medusa (local) - Brasil / BRL

Instalação local do **Medusa v2** para o Lucas - monorepo em `D:\medusa-loja`.

## Abrir no editor (Cursor / VS Code)

1. Abra o Cursor ou o VS Code
2. **File → Open Folder...** (Arquivo → Abrir pasta...)
3. Escolha: `D:\medusa-loja`
4. Confirme - a raiz do projeto deve aparecer no explorador de arquivos

## O que cada pasta é

```
D:\medusa-loja\
  apps\
    backend\       # API Medusa + painel Admin (porta 9000)
    storefront\    # Vitrine Next.js (porta 8000)
  GUIA.md          # Este guia completo
  INICIAR.md       # Atalho com os 3 comandos
  package.json     # Workspace npm / Turbo
```

| Pasta | Função |
|-------|--------|
| `apps\backend` | API, Admin (`/app`), autenticação, produtos, pedidos, regiões |
| `apps\storefront` | Loja pública (Next.js) - o que o cliente vê |
| Container Docker `medusa-postgres` | Banco PostgreSQL (porta **5433** no PC) |

## Como iniciar (3 passos)

### 1) Postgres

```powershell
docker start medusa-postgres
```

- Host: `127.0.0.1` · Porta: **5433** · Banco/user/senha: `medusa-loja` / `medusa` / `medusa`
- `DATABASE_URL` em `apps\backend\.env`: `postgres://medusa:medusa@127.0.0.1:5433/medusa-loja`

### 2) Backend (API + Admin)

```powershell
cd D:\medusa-loja\apps\backend
npm run dev
```

- Admin: http://localhost:9000/app
- API: http://localhost:9000

### 3) Storefront (vitrine)

```powershell
cd D:\medusa-loja\apps\storefront
npm run dev
```

- Loja: http://localhost:8000

## Login do Admin

| Campo | Valor |
|-------|--------|
| E-mail | `admin@avadesk.local` |
| Senha | `MedusaLocal123!` |

## Checklist - configurar **sua** loja

Faça nesta ordem:

1. **Idioma do Admin = Português**  
   Login em http://localhost:9000/app → preferências / perfil (canto inferior ou avatar) → Language / Idioma → **Português** (`pt` / `pt-BR`).

2. **Nome e logo da loja**  
   Settings → Store (ou Configurações → Loja) → altere o nome (hoje: AVADESK) e envie o logo quando quiser.

3. **Produtos em portugues**  
   Products → crie/edite títulos, descrições e preços em **BRL (R$)**.

4. **Região Brasil / BRL / frete**  
   Já existe região **Brasil** (país `BR`, moeda `BRL`) e a loja usa BRL como moeda padrão.  
   Ajuste opções de frete (Shipping) na região Brasil conforme o seu negócio.

5. **Pagamento (depois)**  
   Configure provedor (ex.: Stripe, Mercado Pago via plugin) quando for vender de verdade - não é obrigatório para cadastrar produtos.

6. **Publishable API Key**  
   Já está no storefront (`apps\storefront\.env.local` → `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`) e ligada ao canal de vendas padrão. Em geral **não precisa mexer**.

7. **Editar páginas da vitrine**  
   Código em `apps\storefront\src` (home/hero, menu, etc.). A home já está em portugues básico; o resto da UI ainda pode ter textos em inglês até você traduzir mais.

### Região e moeda (já aplicadas)

- Moeda padrão da store: **BRL**
- Região padrão: **Brasil** (`BR`)
- Storefront: `NEXT_PUBLIC_DEFAULT_REGION=br`
- Região Europa (EUR) ainda existe no Admin - pode ignorar ou remover depois se nao for usar

## Depois da primeira configuração - o que fazer

1. Cadastrar categorias e produtos reais (em portugues, preços em R$)
2. Revisar frete / opcoes de entrega na região Brasil
3. Escolher e configurar pagamento
4. Personalizar visual da vitrine (cores, logo, páginas)
5. Testar o fluxo completo: produto → carrinho → checkout
6. Só então pensar em domínio / deploy (não faça deploy enquanto estiver só testando local)

## Gerenciar a home da BOVINE

A fonte oficial do comportamento atual é `DOCUMENTACAO-SISTEMA.md` na raiz.

- **Banner completo:** Admin → Conteúdo da loja → Banners → envie a arte desktop e, opcionalmente, a arte mobile. Os textos da campanha devem fazer parte da imagem.
- **Departamentos:** Admin → Conteúdo da loja → Informações e home → selecione as categorias exibidas na home. No desktop, clique no nome para abrir a categoria ou na seta para expandir/recolher as subcategorias imediatas; só uma lista fica aberta por vez. No celular, a faixa horizontal permanece e cada item abre sua página, onde as subcategorias também aparecem.
- **Atendimentos:** no mesmo painel, configure o WhatsApp geral e o WhatsApp da Mobile. Veterinário e Agrícola usam o geral; Energia usa o da Mobile.
- Alterações públicas podem levar até 60 segundos para aparecer por causa do cache da vitrine.

## Como parar

- Nos terminais do backend e do storefront: **Ctrl+C**
- Postgres (opcional): `docker stop medusa-postgres`
- No dia a dia: deixe o Postgres rodando e pare só os processos Node

## Problemas comuns

| Problema | O que fazer |
|----------|-------------|
| Docker parado | Abra o Docker Desktop e rode `docker start medusa-postgres` |
| Porta 9000 ou 8000 em uso | Feche o processo antigo (Ctrl+C) ou mate o Node dessa porta |
| Erro de banco | `docker ps` (container Up) e porta **5433** no `.env` |
| Imagens quebradas (404) | Confirme se `apps\backend\static` contém a mídia ligada ao banco restaurado; o provedor local guarda os arquivos fora do banco e essa pasta é ignorada pelo Git. Restaure a cópia de mídia correspondente. |
| Admin não abre | Espere o `npm run dev` do backend compilar; acesse `/app` |
| Loja sem produtos | Confirme a Publishable Key no `.env.local` e reinicie o storefront |
| Precos em euro/dólar | Confirme região Brasil / BRL e que o produto tem preço em BRL |

## Comandos úteis (backend)

```powershell
cd D:\medusa-loja\apps\backend
npx medusa db:migrate
npx medusa user -e admin@avadesk.local -p "MedusaLocal123!"
npm run dev
```
