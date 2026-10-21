# BOVINE Saúde Animal e Agro — Documentação do Sistema

| Item | Valor |
|---|---|
| Versão do sistema | 1.2.0 — Menu lateral de departamentos |
| Última atualização | 21/10/2026 — departamentos movidos para um painel hambúrguer lateral, recolhível e disponível nas páginas principais da loja |
| Fonte oficial | Este arquivo |

## 1. Como usar este documento

Este arquivo registra o comportamento atual da loja BOVINE. Os guias antigos em `docs/` continuam como material de instalação e operação, mas este documento é a fonte oficial das regras da interface.

## 2. Tecnologias utilizadas

- Storefront Next.js, React e Tailwind CSS.
- Backend e painel administrativo Medusa v2.
- PostgreSQL para os dados do Medusa e do módulo `store-content`.

### 2.1 Histórico de versões

| Versão | Data | Mudança |
|---|---|---|
| 1.2.0 — Menu lateral de departamentos | 21/10/2026 | Painel de departamentos em altura total acionado pelo cabeçalho, disponível nas páginas principais da loja e fechável por botão, fundo ou Esc. |
| 1.1.8 — Subcategorias visíveis | 21/10/2026 | A primeira categoria com subcategorias inicia expandida; a seta continua permitindo recolher ou trocar de departamento aberto. |
| 1.1.7 — Banner alinhado aos departamentos | 21/10/2026 | Colunas da home compartilham altura e a arte cobre o cartão sem faixa branca inferior. |
| 1.1.6 — Banner sem faixa vazia | 21/10/2026 | Mantém a altura proporcional original da imagem no banner, sem criar espaço vazio por uma altura mínima imposta. |
| 1.1.5 — Banner ajustado à imagem | 21/10/2026 | Limita a altura visível da arte e usa corte central para evitar área vazia dentro do banner. |
| 1.1.4 — Departamentos expansíveis | 21/10/2026 | Departamentos da home no desktop expandem suas subcategorias imediatas; faixa móvel mantida. |
| 1.1.3 — Cabeçalho sem sobreposição | 21/10/2026 | A busca preserva largura mínima no desktop e links fluem para outra linha quando necessário. |
| 1.1.2 — Cabeçalho sem sobreposição | 21/10/2026 | Layout compacto mantido até 1279 px para impedir links do cabeçalho de cobrirem a busca. |
| 1.1.1 — Cabeçalho responsivo | 21/10/2026 | Ajuste do cabeçalho em larguras compactas para evitar sobreposição entre menu, marca, busca e carrinho. |
| 1.1.0 — Home de atendimentos | 21/10/2026 | Banner em arte completa, departamentos ao lado e três atalhos de atendimento. |
| 1.0.3 | Anterior | Versão anterior do storefront. |

## 3. Mapa de telas e conexões

| Tela | Área | Conexão |
|---|---|---|
| Páginas principais da loja | Departamentos | Botão hambúrguer no cabeçalho abre o painel lateral com as categorias selecionadas em Conteúdo da loja e suas subcategorias imediatas. |
| Home da loja | Banner principal | Primeiro banner principal ativo; a arte usa imagem desktop/mobile e pode ter um destino de clique. |
| Home da loja | Atendimentos | Veterinário e Agrícola usam o WhatsApp geral; Energia usa o WhatsApp da Mobile. |
| Todas as telas da loja | Cabeçalho | Menu, marca, busca, conta e carrinho se reorganizam conforme a largura disponível. |
| Admin | Conteúdo da loja → Banners | Upload das artes completas e destino opcional do banner. |
| Admin | Conteúdo da loja → Informações e home | Números de WhatsApp e seleção dos departamentos. |

## 4. Papéis e acesso

- A home é pública.
- A edição de Conteúdo da loja exige sessão administrativa válida do Medusa.
- As rotas administrativas usam o middleware de autenticação já configurado para `/admin/*`.

## 5. Índice de rotas e onde olhar no código

| Comportamento | Rota | Onde olhar |
|---|---|---|
| Home | `/{countryCode}` | `apps/storefront/src/app/[countryCode]/(main)/page.tsx` |
| Conteúdo público | `/store/avadesk-content` | `apps/backend/src/api/store/avadesk-content/route.ts` |
| Configuração administrativa | `/admin/avadesk-content` | `apps/backend/src/api/admin/avadesk-content/route.ts` |
| Cadastro de banners | `/admin/avadesk-content/banners` | `apps/backend/src/api/admin/avadesk-content/banners/` |
| Gravação das configurações | Workflow | `apps/backend/src/workflows/update-store-content-settings.ts` |

## 6. Telas e fluxos

### Home e navegação de departamentos

- O card compacto de departamentos foi removido da home; o banner ocupa a largura completa do conteúdo.
- O botão hambúrguer **Departamentos**, à esquerda do cabeçalho, abre um painel lateral de altura total nas páginas principais da loja.
- O painel mostra as categorias escolhidas em **Conteúdo da loja → Informações e home**, na ordem configurada; se nenhuma estiver escolhida, mostra as categorias principais.
- O primeiro departamento com subcategorias inicia expandido. O nome abre a categoria e a seta expande ou recolhe as subcategorias imediatas; apenas uma lista fica aberta por vez.
- O mesmo painel funciona em desktop e celular. Pode ser fechado pelo botão **X**, clicando fora do painel ou pressionando **Esc**. No celular, o painel ocupa quase toda a largura da tela.
- Quando existe imagem, o banner não recebe texto, selo ou botão sobreposto pelo storefront.
- A imagem mobile é opcional. Sem ela, a imagem desktop também é usada no celular.
- A arte do banner preenche o espaço disponível sem sobrepor textos, selos ou botões do storefront.
- O clique no banner só existe quando o campo de destino está preenchido.
- Abaixo do banner aparecem Atendimento Veterinário, Atendimento Agrícola e Soluções em Energia.

### Cabeçalho da loja

- Em larguras compactas, menu, marca, busca e carrinho ocupam uma linha com espaços flexíveis; a marca pode truncar para manter os controles separados.
- O cabeçalho desktop completo é exibido a partir do breakpoint `medium` (1280 px). A busca preserva largura mínima; links e controles podem fluir para outra linha quando o espaço disponível não comporta todos os elementos.

### Conteúdo da loja

| Seção | Campo | Regra | Efeito |
|---|---|---|---|
| Informações e home | WhatsApp | Número geral com DDI | Usado nos atendimentos Veterinário e Agrícola. |
| Informações e home | WhatsApp da Mobile | 10 a 15 dígitos, somente números | Usado exclusivamente em Soluções em Energia. |
| Informações e home | Categorias exibidas na home | Nenhuma marcada usa as categorias principais | Define os departamentos e sua ordem. |
| Banners | Nome interno / texto alternativo | Obrigatório | Identifica e descreve a arte. |
| Banners | Arte completa desktop | Opcional | Imagem principal de ponta a ponta. |
| Banners | Arte completa mobile | Opcional | Substitui a imagem principal abaixo de 1024 px. |
| Banners | Destino ao clicar | Opcional | Aceita caminho interno, `#chat` ou URL externa. |

## 7. Regras de negócio

- Atendimento Veterinário abre o WhatsApp geral com mensagem de urgência veterinária.
- Atendimento Agrícola abre o WhatsApp geral com mensagem de agendamento agrícola.
- Soluções em Energia abre o WhatsApp da Mobile com mensagem sobre energia.
- Sem o número necessário, o cartão permanece visível e indisponível, sem gerar link inválido.
- O botão **Departamentos** do cabeçalho abre a navegação lateral nas páginas principais da loja. O painel pode ser fechado pelo **X**, pelo fundo escurecido ou pela tecla **Esc**.
- A primeira categoria com subcategorias inicia expandida. A seta expande apenas as subcategorias imediatas; os nomes abrem suas respectivas páginas.
- A expansão é exclusiva: abrir outro departamento recolhe o anterior. A navegação usa as categorias escolhidas no admin e mantém o link **Ver todos**.
- Campos antigos de texto e botões do banner são preservados no banco por compatibilidade, mas não são exibidos sobre a arte principal.
- O conteúdo público pode levar até 60 segundos para refletir alterações por causa do cache do storefront.

## 8. Como usar o sistema

### Trocar o banner

1. No admin, abra **Conteúdo da loja → Banners**.
2. Crie ou edite um banner com posição **Banner principal**.
3. Preencha o nome interno, envie a arte desktop e, se houver, a arte mobile.
4. Opcionalmente preencha **Destino ao clicar no banner**.
5. Salve e aguarde até 60 segundos para a atualização da home.

### Configurar os atendimentos

1. Abra **Conteúdo da loja → Informações e home**.
2. Informe o WhatsApp geral e o **WhatsApp da Mobile**, ambos com DDI.
3. Marque as categorias que devem aparecer como departamentos.
4. Salve as configurações.

### Navegar pelos departamentos

- Nas páginas principais da loja, clique em **Departamentos** à esquerda do cabeçalho para abrir o painel.
- A primeira categoria com subcategorias já aparece aberta. Clique no nome do departamento para abrir sua página ou use a seta para mostrar/recolher subcategorias; apenas uma lista fica aberta por vez.
- Feche o painel pelo **X**, clicando fora dele ou pressionando **Esc**. No celular, o mesmo fluxo abre um painel quase em tela cheia.

## 9. Checklist de validação

- Conferir arte desktop e mobile sem sobreposição.
- Conferir banner com e sem destino, inclusive arte panorâmica, sem faixa vazia abaixo da imagem.
- Conferir botão e painel de departamentos no desktop e celular, incluindo abrir/fechar, primeira categoria expandida, categorias com e sem subcategorias, expansão exclusiva e navegação pelos nomes.
- Conferir menu, marca, busca e carrinho em larguras compactas e desktop sem sobreposição.
- Conferir número e mensagem dos três atalhos.
- Conferir o estado indisponível quando um número estiver vazio.

## 10. Segurança

- O número da Mobile é validado no backend como 10 a 15 dígitos.
- Nenhum segredo é salvo nesses campos.
- Links externos abrem em nova aba com `noreferrer`.

## 11. Deploy e ambiente

- No ambiente local deste workspace, a loja abre em `http://localhost:8000` e redireciona para a região brasileira (`/br`). A API e o Admin Medusa usam `http://localhost:9000`.
- O PostgreSQL e o Redis locais usam as portas `5434` e `6382`. As conexões e a chave pública ficam nos arquivos ignorados pelo Git `apps/backend/.env` e `apps/storefront/.env.local`; não copie valores desses arquivos para documentação ou chamados.
- Use `scripts/dev-local-start.ps1` para iniciar os contêineres locais existentes e os processos que ainda não estiverem respondendo. Use `scripts/dev-local-stop.ps1` para encerrar somente os processos Node iniciados pelo script; os contêineres de banco e Redis continuam ligados e seus dados são preservados.
- Os logs de inicialização ficam em `.setup-bovine/runtime/`, diretório ignorado pelo Git.
- A migration `Migration20261021130000` adiciona `mobile_whatsapp` a `avadesk_content_setting`.
- A alteração local não executa migration nem publica código em produção.
- O provedor `file-local` grava os arquivos enviados em `apps/backend/static`; o banco guarda as URLs, não o conteúdo binário das imagens.
- `apps/backend/static` é ignorada pelo Git. Ao mover o ambiente ou restaurar uma cópia do banco, restaure também a pasta de mídia correspondente para que banners, categorias e produtos não apontem para arquivos ausentes.
- Em publicação autorizada, executar as migrations antes de reiniciar o backend e validar a home.

## 12. Ao atualizar este documento

Atualize versão, histórico, mapa, regras e guia sempre que o comportamento da home ou do painel Conteúdo da loja mudar.
