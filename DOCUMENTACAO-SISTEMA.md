# BOVINE Saúde Animal e Agro — Documentação do Sistema

| Item | Valor |
|---|---|
| Versão do sistema | 1.4.0 — Vitrine de e-commerce |
| Última atualização | 05/11/2026 — home com cara de loja: tarja de benefícios, banner horizontal com reserva desenhada em código, grade de departamentos, vitrines que não exibem “0 produtos”, Pix e parcelamento só com preço real, rodapé com formas de pagamento e botão de WhatsApp |
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
| 1.4.0 — Vitrine de e-commerce | 05/11/2026 | A home passa a ler como loja: tarja no topo, marca BOVINE em código, banner horizontal (arte do admin ou desenho reserva), departamentos em grade, prateleiras de ofertas, mais vendidos e novidades, estado vazio sem “0 produtos”, atalho de WhatsApp oculto quando falta número, cabeçalho em uma linha a partir de 1024 px, selos de pagamento no rodapé e botão flutuante de WhatsApp. Pix e parcelamento ficam em `store-pricing.ts`, desligados por padrão e só aparecem com preço real. |
| 1.3.0 — Identidade visual e navegação do aplicativo | 23/10/2026 | Sistema visual único em toda a loja: cartões brancos com borda e sombra sobre fundo cinza-claro, texto e botões maiores, rodapé em azul-escuro, campos com rótulo sempre visível, barra inferior do celular revista e página sem conexão redesenhada. |
| 1.2.1 — Menu lateral de departamentos | 23/10/2026 | Na home a partir de 1280 px, os departamentos permanecem visíveis em uma lateral fixa abaixo do cabeçalho; celular, tablet e demais páginas preservam o painel acionado pelo botão. |
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
| Home da loja | Departamentos | A partir de 1280 px, lateral fixa com as categorias selecionadas em Conteúdo da loja e suas subcategorias imediatas. |
| Demais páginas e home abaixo de 1280 px | Departamentos | Botão hambúrguer no cabeçalho abre o painel lateral com as mesmas categorias e subcategorias. |
| Home da loja | Banner principal | Banners principais ativos, em quadro horizontal. Se a imagem mobile falhar, usa a desktop. Se nenhuma carregar, entra o banner desenhado em código. |
| Home da loja | Vitrine | Ofertas, mais vendidos, destaques e novidades. Sem produtos publicados, um estado vazio com as prateleiras nomeadas e os departamentos. |
| Home da loja | Atendimentos | Veterinário e Agrícola usam o WhatsApp geral; Energia usa o WhatsApp da Mobile. Sem número, o atalho não aparece. |
| Todas as telas da loja | Cabeçalho | A partir de 1024 px, menu, marca, busca, atalhos, conta e carrinho ficam na mesma linha. |
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

- Na home a partir de 1280 px, os departamentos ficam sempre visíveis em uma lateral à esquerda do conteúdo. A lateral permanece abaixo do cabeçalho durante a rolagem e usa rolagem interna quando a lista ultrapassa a altura disponível.
- Na home abaixo de 1280 px e nas demais páginas, o botão hambúrguer abre o painel lateral. O rótulo **Departamentos** só entra na linha do cabeçalho a partir de 1440 px, para a linha não quebrar.
- O painel mostra as categorias escolhidas em **Conteúdo da loja → Informações e home**, na ordem configurada; se nenhuma estiver escolhida, mostra as categorias principais.
- O primeiro departamento com subcategorias inicia expandido. O nome abre a categoria e a seta expande ou recolhe as subcategorias imediatas; apenas uma lista fica aberta por vez.
- O painel recolhível pode ser fechado pelo botão **X**, clicando fora ou pressionando **Esc**. No celular, ocupa quase toda a largura da tela.
- Acima do cabeçalho há uma tarja de benefícios. Ela usa os selos cadastrados em Informações e home; se não houver nenhum, mostra entrega, orientação, pagamento seguro e atendimento.
- O banner principal é horizontal (`4/3` no celular e `21/8` no computador). Vários banners ativos viram um carrossel.
- Quando a imagem existe e carrega, o storefront não coloca texto, selo ou botão por cima da arte.
- A imagem mobile é opcional. Se ela falhar ou não existir, a imagem desktop é usada. Se nenhuma carregar, o banner desenhado em código entra no mesmo quadro. Texto alternativo solto não aparece.
- O clique no banner do admin só existe quando o campo de destino está preenchido.
- Abaixo do banner, a grade de departamentos usa ícone pelo nome da categoria. Sem foto de produto, o card mostra a moldura “Foto em breve”.
- Ofertas, mais vendidos, destaques e novidades só aparecem quando há produtos de verdade. Mais vendidos depende de uma coleção cujo título contenha “mais vendidos”. Sem nenhum produto, a home mostra as quatro prateleiras vazias e os departamentos, sem a frase “0 produtos”.
- Os atalhos de atendimento ficam depois da vitrine. Sem o número daquele atalho, ele não é renderizado.
- O botão flutuante de WhatsApp usa o número geral. Sem número válido, o botão não aparece.

### Cabeçalho da loja

- A marca, quando não há logo enviado, é o monograma BOVINE desenhado em código. A linha “Saúde Animal e Agro” só aparece a partir de 1440 px.
- A partir de 1024 px o cabeçalho de controles é uma única linha: menu, marca, busca, atalhos, carrinho e conta. A busca encolhe; os atalhos rolam dentro da própria faixa se não couberem. A conta mostra só o ícone até 1440 px.
- No celular, menu, marca, carrinho e conta ficam na primeira linha e a busca na segunda.

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

### Sistema visual (superfícies, texto e botões)

- Os tokens ficam em `apps/storefront/tailwind.config.js` e as classes de apoio em `apps/storefront/src/styles/globals.css`. Toda tela nova deve usá-los em vez de cores ou sombras escritas à mão.
- Fundo da página `canvas` (`#EEF2F6`); todo bloco de conteúdo é um cartão branco com borda `line` e sombra, aplicado pela classe `.card-surface` (ou `.card-interactive`, que acrescenta o realce ao passar o mouse).
- Sombras disponíveis: `shadow-card`, `shadow-card-hover`, `shadow-raised`, `shadow-overlay`, `shadow-sticky`, `shadow-header` e `shadow-brand-glow`. Não usar valores arbitrários.
- Laranja `brand` é reservado para a ação principal da tela; azul-escuro `navy` é a cor de estrutura (cabeçalho, rodapé, seleção).
- Texto: escala `body-lg` 17 px, `body-md` 16 px, `body-sm` 14 px, pensada para leitura confortável. Os tons `ink-soft` e `ink-muted` foram escurecidos para atender ao contraste mínimo de acessibilidade.
- Botões: 44 px (`small`), 48 px (`medium`) e 52 px (`large`/`h-13`). No celular, todo botão tem no mínimo 48 px de altura.
- Campos de formulário têm o rótulo sempre visível acima do campo, altura de 52 px e erro em texto logo abaixo.
- `1024 px` (`small`) é a única fronteira entre celular e computador; `tablet` (768 px) existe apenas para ajustar colunas. Os prefixos `sm:`, `md:`, `lg:` e `xl:` não existem neste projeto.

### Navegação no celular e aplicativo instalado

- A barra inferior fixa tem 68 px, quatro destinos (Início, Buscar, Carrinho, Conta), rótulos sempre visíveis e marca o destino atual com uma faixa laranja.
- As telas reservam o espaço da barra com `.pb-nav` (84 px mais a área de gestos, para o conteúdo terminar acima da barra de 68 px) ou `.pb-nav-lg` quando há também uma barra de ação fixa, como no carrinho, no produto e no checkout. Não usar `pb-16`, `pb-24` ou `pb-32`.
- As barras fixas de ação usam `.bar-sticky` e ficam acima da barra inferior, respeitando a área de gestos do aparelho.
- No checkout, o celular mostra o nome do passo atual e uma barra de progresso ("Passo 2 de 4"); a trilha completa com ícones aparece a partir de 1024 px.

## 7. Regras de negócio

- Atendimento veterinário abre o WhatsApp geral com mensagem de urgência veterinária.
- Atendimento agrícola abre o WhatsApp geral com mensagem de agendamento agrícola.
- Soluções em energia abre o WhatsApp da Mobile com mensagem sobre energia.
- Sem o número necessário, o atalho não é exibido. Não há estado “WhatsApp não configurado”.
- Pix e parcelamento sem juros são calculados em `apps/storefront/src/lib/util/store-pricing.ts`. Os padrões do arquivo estão desligados (`null`). Se o admin preencher `pix_discount_percent` ou `max_installments`, esses valores prevalecem. O texto só aparece quando o produto, o item da busca ou o total do carrinho tem preço maior que zero.
- O rodapé lista as formas de pagamento em texto (Pix, Visa, Mastercard, Elo, Hipercard, Amex e boleto), porque a loja não recebeu as artes oficiais das bandeiras.
- A loja não publica produto, preço, marca ou depoimento de exemplo. Um catálogo vazio permanece vazio, com estado visual de prateleira em preparação.
- Na home desktop a partir de 1280 px, a navegação de departamentos fica aberta e o botão do cabeçalho é ocultado. Nas demais páginas e abaixo desse tamanho, o botão **Departamentos** abre o painel, que pode ser fechado pelo **X**, pelo fundo escurecido ou pela tecla **Esc**.
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
5. Salve e aguarde até 60 segundos para a atualização da home. A arte entra no quadro horizontal. Se o arquivo não abrir, a home mostra o banner desenhado em código, sem texto alternativo solto.

### Configurar os atendimentos

1. Abra **Conteúdo da loja → Informações e home**.
2. Informe o WhatsApp geral e, se houver, o **WhatsApp da Mobile**, ambos com DDI. O atalho sem número fica oculto.
3. Marque as categorias que devem aparecer como departamentos. O percentual de Pix e o número de parcelas também ficam nesta área; em branco, a vitrine não mostra desconto nem parcelamento.
4. Salve as configurações.

### Navegar pelos departamentos

- No computador, a linha do cabeçalho não quebra: a busca encolhe e os atalhos rolam dentro da faixa.
- Na home desktop a partir de 1280 px, use a lateral **Departamentos** à esquerda; não é necessário abrir um painel.
- Na home abaixo de 1280 px e nas demais páginas, clique em **Departamentos** à esquerda do cabeçalho para abrir o painel.
- A primeira categoria com subcategorias já aparece aberta. Clique no nome para abrir sua página ou use a seta para mostrar/recolher subcategorias; apenas uma lista fica aberta por vez.
- Quando estiver usando o painel, feche pelo **X**, clicando fora ou pressionando **Esc**. No celular, ele ocupa quase toda a tela.

## 9. Checklist de validação

- Conferir arte desktop e mobile sem sobreposição.
- Conferir banner com e sem destino, inclusive arte panorâmica, sem faixa vazia abaixo da imagem.
- Conferir a lateral fixa da home em 1280, 1440 e 1920 px, incluindo permanência durante a rolagem, rolagem interna e ausência do botão no cabeçalho.
- Conferir botão e painel na home abaixo de 1280 px e nas demais páginas, incluindo abrir/fechar, primeira categoria expandida, categorias com e sem subcategorias, expansão exclusiva e navegação pelos nomes.
- Conferir menu, marca, busca, atalhos, conta e carrinho em uma única linha em 1024, 1280 e 1440 px.
- Conferir as telas em 390 px, 768 px, 1100 px e 1280 px: home, produtos, categoria, produto, carrinho, checkout, conta, pedidos, entrar e uma rota inexistente.
- Conferir que em 1100 px o cabeçalho e a grade de produtos trocam juntos para o formato de computador.
- Conferir ausência de rolagem horizontal em 390 px.
- Conferir que a barra inferior não cobre o fim da home, da listagem, do carrinho nem do rodapé.
- Conferir que uma imagem de banner ou de produto quebrada não deixa texto alternativo solto.
- Conferir o foco visível ao navegar somente pelo teclado em entrar, produto e checkout.
- Conferir o aplicativo instalado: service worker na versão `bovine-v2`, visual novo após a atualização e página sem conexão em modo avião.
- Conferir que cada atalho de atendimento só aparece com número válido.
- Conferir que Pix e parcelamento não aparecem sem preço real, e que os percentuais saem de `store-pricing.ts` ou do admin.

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
- Ao alterar `apps/storefront/public/sw.js`, aumentar o valor de `VERSION`. Sem isso, os aparelhos que já instalaram a loja continuam exibindo a versão antiga em cache.

## 12. Ao atualizar este documento

Atualize versão, histórico, mapa, regras e guia sempre que o comportamento da home ou do painel Conteúdo da loja mudar.
