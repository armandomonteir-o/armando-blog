# Ecossistema do blog

Mapa de onde cada peça mora, quem fala com quem e o que falta registrar. Escrito em 18/10/2026.

**Como ler:** cada afirmação está marcada como **[confirmado]** (verifiquei no código ou numa requisição real hoje) ou **[conferir]** (só o dono da conta sabe: painel, fatura, e-mail). Nada aqui contém senha, chave ou usuário de SSH. Só nomes de variáveis.

## Visão geral

```
 Navegador
    │
    ▼
 Vercel ── armando-blog.vercel.app ── Next.js 16 (este repositório: blog-armandin)
    │            │
    │            ├── Google OAuth (login, via Auth.js)
    │            └── @vercel/analytics
    │
    │  GraphQL (WPGraphQL)  +  REST (comentários, perfil, avatar)
    ▼
 Hostinger (hPanel) ── armandomonteiro.com ── WordPress headless
                         └── tema + plugin próprios (repositório blog-cms)
```

O WordPress é só o back-end (CMS e API). Quem o visitante vê é o Next.js na Vercel.

## Peças

### 1. Front-end: Vercel

| Item | Estado |
|---|---|
| URL pública | `https://armando-blog.vercel.app` **[confirmado]**, responde 200 |
| Código | repositório `armandomonteir-o/armando-blog` (pasta local `blog-armandin`) **[confirmado]** |
| Stack | Next.js 16 (App Router), Tailwind v4, TypeScript, Zustand **[confirmado]** |
| Deploy | automático a cada push, com preview por PR **[confirmado]**: o status "Vercel" aparece nas PRs |
| CI | GitHub Actions: type-check, lint, test e build **[confirmado]** |
| Plano da Vercel | **[conferir]** provavelmente Hobby (gratuito). Confira em Settings → Billing |
| Domínio próprio apontando para a Vercel | ainda não. O destino será `blog.armandomonteiro.com` (ver "Endereços finais") |

Variáveis de ambiente que o front lê (só nomes):

| Variável | Para quê | Onde precisa existir |
|---|---|---|
| `WORDPRESS_API_URL` | endereço do endpoint WPGraphQL | Vercel (Production), `.env.local` e **variável do repositório no GitHub** (usada pelo CI; é uma URL pública, não segredo) |
| `WP_APP_USER`, `WP_APP_PASSWORD` | credencial de aplicação do WordPress, para as rotas que escrevem (comentário, perfil) | Vercel e `.env.local` |
| `REVALIDATE_SECRET` | segredo que o WordPress manda para `POST /api/revalidate`; sem ele a rota recusa todas as chamadas (503) | Vercel (Production) e `.env.local`; o mesmo valor vai na configuração do WordPress (etapa 3 da #68) |
| `AUTH_SECRET` | cifra a sessão do Auth.js | Vercel (criada em 18/10, ver #91) |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | cliente OAuth do Google | Vercel (criadas em 18/10) |
| `NEXT_PUBLIC_VERCEL_URL`, `NEXT_PUBLIC_ENABLE_COMMENTS` | flag e URL pública | `.env.local`; **[conferir]** na Vercel |
| `NEXT_PUBLIC_ENABLE_NEWSLETTER` | mostra o widget de newsletter; **só a string exata `true` liga**, e sem a variável ele fica escondido (#112). Entra no bundle no build, então mudar na Vercel só vale no deploy seguinte | `.env.local`; na Vercel **[conferir]**: se estiver `true`, o widget continua aparecendo e descartando o e-mail |

O Auth.js lê as três `AUTH_*` sozinho, sem aparecer no código. Foi por isso que a produção ficou com login quebrado (#91).

### 2. CMS: WordPress na Hostinger

| Item | Estado |
|---|---|
| Hospedagem | Hostinger, painel hPanel **[confirmado]**: o servidor responde com os cabeçalhos `platform: hostinger` e `panel: hpanel` |
| Servidor | LiteSpeed, PHP 8.3 **[confirmado]** |
| Endereço do WordPress | `https://armandomonteiro.com` **[confirmado]**: o GraphQL responde em `/graphql` |
| Tipo de plano (compartilhado, Cloud, VPS), nome do plano, preço, data de renovação | **[conferir]** hPanel → Cobrança. O caminho `/home/<usuario>/domains/armandomonteiro.com/public_html` indica hospedagem compartilhada, mas confirme |
| Backups | **[conferir]** hPanel → Backups: o que a Hostinger guarda e por quanto tempo |
| Acesso | SSH com porta própria (variáveis `SSH_HOST`, `SSH_PORT`, `SSH_USER` no `.env` do `blog-cms`) **[confirmado]** |
| Plugins necessários | WPGraphQL, Advanced Custom Fields, WPGraphQL para ACF **[confirmado]**, em `setup.sh` |
| Código próprio | tema `armando-headless` (vazio, o WP exige um) e plugin `armando-headless-plugin` (CORS, CPT de playlists, limites do GraphQL, hardening, grupos ACF) **[confirmado]**, no repositório `blog-cms` |
| Conteúdo hoje | 6 posts de **teste** em lorem ipsum (ids 17 a 22), nas subcategorias `games/stardew-valley`, `games/habbo`, `estudos/pixel-art` e `estudos/programacao-criativa`, criadas em 18/10/2026 **[confirmado]** por `wp term list` e pelo GraphQL. As categorias antigas (`arte, blog, cultura, design, filosofia, tecnologia`) continuam, sem posts. Os 6 posts de exemplo originais foram apagados em 18/10/2026 por decisão do dono (não eram autorais), com backup em XML na máquina dele. **Apagar os posts lorem ipsum antes de apresentar o blog como demo final.** |
| Moderação de comentários | `comment_moderation = 1` (todo comentário espera aprovação) e `comment_previously_approved = 1` **[confirmado]** por `wp option get` e pelo teste `comments.live.test.ts` em 18/10/2026. Se alguém desligar a moderação, comentaristas recorrentes publicam sem aprovação (PITFALL-013) |
| Fuso do WordPress | `America/Sao_Paulo` desde 18/10/2026 **[confirmado]**: o GraphQL devolve `timezone: "America\/Sao_Paulo"`, e um post publicado às 01:30 UTC saiu com `date` `2026-10-17T22:30:00` e `dateGmt` `2026-10-18T01:30:00`. Antes estava vazio (UTC) e o dia saía errado à noite (#78). Se alguém zerar, o teste live `has a timezone set` acusa |

### 3. Login: Google

- Auth.js (`next-auth` v5) com o provider Google **[confirmado]**.
- O cliente OAuth fica no Google Cloud Console da sua conta Google. **[conferir]** em qual projeto e com qual conta.
- URI de redirecionamento cadastrada para produção: `https://armando-blog.vercel.app/api/auth/callback/google` **[confirmado]**: o login funcionou em 18/10.
- Se o domínio do front mudar (ver "Decisões em aberto"), essa URI precisa ser cadastrada de novo.

### 4. Domínio e DNS

| Item | Estado |
|---|---|
| Domínio | `armandomonteiro.com` **[confirmado]** |
| Aponta para | Hostinger (o endereço IPv6 resolvido é da faixa da Hostinger) **[confirmado]** |
| `cms.armandomonteiro.com` | **não existe** no DNS **[confirmado]** |
| `armando-blog.vercel.app` | Vercel **[confirmado]** |
| Onde o domínio foi registrado, quem controla o DNS, quando vence | **[conferir]** o `whois` não devolveu nada. Veja hPanel → Domínios, ou o e-mail de compra |

### 5. Repositórios

| Repositório | O que é |
|---|---|
| `armandomonteir-o/armando-blog` | front-end Next.js (pasta local `blog-armandin`) |
| `armandomonteir-o/blog-cms` | tema e plugin do WordPress, mais scripts de deploy |

## Como o conteúdo chega ao site (cache)

A home, `/posts` e cada post são gerados no build e refeitos em segundo plano no máximo uma vez por hora (**[confirmado]**: `Revalidate 1h` na saída do `next build`, e `Cache-Control: s-maxage=3600` num servidor de produção). Post novo ou editado aparece em até uma hora, sem deploy. A decisão está no ADR-014. Além da hora, o WordPress **avisa o site** quando um post ou comentário muda, e as páginas afetadas são refeitas em segundos **[confirmado]** em produção em 18/10/2026: um post publicado apareceu na lista em 1,3 s, um slug renomeado virou 404 em 0,9 s, um comentário aprovado apareceu na home em 2,8 s (detalhes no ADR-014). A rota é `POST /api/revalidate` no site (protegida por `REVALIDATE_SECRET`), e quem chama é o plugin `armando-headless-plugin` (`includes/revalidate.php`, ADR-007 do `blog-cms`), que lê duas constantes do `wp-config.php` do servidor: `ARMANDO_REVALIDATE_URL` e `ARMANDO_REVALIDATE_SECRET`. Se o aviso falhar, o WordPress registra uma linha `[armando-revalidate]` no log de erros do PHP, e o site se atualiza sozinho em até uma hora.

## Como o código chega em cada lugar

- **Front:** `git push` → Vercel faz o build e publica sozinha.
- **WordPress (tema e plugin):** **só** por `./deploy.sh` no `blog-cms` (rsync por SSH). Nunca pelo Git da Hostinger.
  - O deploy por Git do hPanel clona o repositório inteiro em `public_html/` e **apagou o WordPress inteiro duas vezes** (ADR-006 do `blog-cms`).
  - `deploy.sh` mexe apenas em `wp-content/themes/armando-headless/` e `wp-content/plugins/armando-headless-plugin/`.
- **Primeira instalação do WordPress:** `setup.sh` (plugins e tema) e depois `setup-content.sh` (categorias e posts de exemplo, não repetir).

## Problemas conhecidos no ecossistema

1. **O README do `blog-cms` recomenda o que o ADR-006 proíbe.** Ele diz "GitHub OAuth (recommended)" para deploy. O ADR-003 diz o mesmo, e o ADR-006 o revogou depois que o deploy apagou o WordPress. Quem seguir o README destrói o site. Corrigido na PR #3 do `blog-cms`, já na main **[confirmado]** (commit `29571cf`).
2. **O mesmo README citava `cms.armandomonteiro.com/graphql`**, que não existe no DNS. O endereço real de hoje é `armandomonteiro.com/graphql`.
3. **Cache de 7 dias na resposta do GraphQL.** A resposta de `/graphql` vem com `cache-control: public, max-age=604800`. Pode ser o cache da Hostinger. Se for, isso explica conteúdo velho e pesa na decisão da #68. Vale confirmar antes de decidir a estratégia de cache.
4. **O domínio raiz hoje é a API.** `armandomonteiro.com` serve o WordPress, que responde com `x-robots-tag: noindex` (correto para uma API), mas ele está reservado para o portfólio. Ver "Endereços finais".
5. **Sem teste que olhe o ambiente publicado.** Cobertos por #103 (smoke test do login) e #104 (fluxo autenticado).

## Endereços finais (decidido em 18/10/2026)

| Endereço | O que será | Hoje |
|---|---|---|
| `armandomonteiro.com` | site de portfólio | é o WordPress (API) |
| `blog.armandomonteiro.com` | este blog (Next.js, Vercel) | `armando-blog.vercel.app` |
| `cms-blog.armandomonteiro.com` (nome provisório) | WordPress do blog (Hostinger) | `armandomonteiro.com/graphql` |

**Migração, na ordem em que precisa acontecer** (nada disso foi feito ainda):

1. Criar o subdomínio do CMS na Hostinger e mover o WordPress para ele. Atenção: mudar a URL do site no WordPress também reescreve links no banco. Fazer com backup.
2. Atualizar `WORDPRESS_API_URL` na Vercel e o `hostname` em `remotePatterns` no `next.config.ts` (as imagens vêm do WordPress).
3. Apontar `blog.armandomonteiro.com` para a Vercel (registro CNAME no DNS) e cadastrar o domínio no projeto da Vercel.
4. No Google Cloud, cadastrar `https://blog.armandomonteiro.com/api/auth/callback/google` nas URIs de redirecionamento. Sem isso o login falha com `redirect_uri_mismatch`.
   **Também, no servidor do WordPress:** trocar a constante `ARMANDO_REVALIDATE_URL` do `wp-config.php` para `https://blog.armandomonteiro.com/api/revalidate` (`wp config set ARMANDO_REVALIDATE_URL <url> --type=constant`). Se isso for esquecido, o aviso continua indo para o endereço antigo, a falha só aparece no log, e o site vale só a hora.
5. Só então apontar o domínio raiz para o portfólio.

Se a ordem for trocada (raiz primeiro), a API do blog sai do ar. O passo 1 é o de maior risco e precisa de backup antes.

## Decisões em aberto (suas)

- **Renovar o plano da Hostinger?** Depende do preço e de quando vence **[conferir]**. O plano agora hospeda o CMS do blog e, depois, o portfólio.
- **Estratégia de cache (#68).**
- **Manter `CLAUDE.md` e `AGENTS.md` versionados (#80).**
- **O post de brincadeira `corrupted-post`:** sai ou continua como elemento fixo, sem se passar por post (#70).

## Checklist para você preencher (só o painel responde)

- [ ] Hostinger: nome do plano, tipo, preço, **data de renovação**, forma de pagamento
- [ ] Hostinger: o domínio `armandomonteiro.com` foi comprado lá ou em outro registrador? Data de vencimento do domínio
- [ ] Hostinger: backups automáticos ligados? Frequência
- [ ] Hostinger: o domínio tem e-mail profissional contratado?
- [ ] Vercel: plano (Hobby ou Pro) e quem é o dono do projeto
- [ ] Google Cloud: nome do projeto e conta que criou o cliente OAuth
- [ ] Onde estão guardados os acessos (gerenciador de senhas): SSH da Hostinger, senha de aplicação do WordPress, segredos do OAuth
