# ADR-017 — Cabeçalhos de segurança HTTP, com o CSP só em modo relatório

**Status:** Accepted (CSP ainda em Report-Only; ver "O que falta para fechar a #135")  
**Date:** 2026-10-18  
**Issue:** #135

---

## Contexto

O `next.config.ts` só tinha o `remotePatterns` de imagens. Medido em produção com `curl -sI https://armando-blog.vercel.app/` (18/10/2026): a Vercel já manda `strict-transport-security: max-age=63072000; includeSubDomains; preload`, e nenhum outro cabeçalho de segurança (sem `nosniff`, sem `Referrer-Policy`, sem `Permissions-Policy`, sem proteção contra iframe, sem CSP).

O site depende de três coisas externas que um CSP errado derrubaria: o login do Google (formulário do Auth.js que redireciona para `accounts.google.com`), o Vercel Analytics e as imagens do WordPress e do Google/Gravatar.

## Decisão

`headers()` em `next.config.ts`, para `/:path*`:

- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` desligando câmera, microfone, geolocalização, pagamento e USB, e `X-Frame-Options: DENY`. Esses quatro valem já.
- **HSTS não entra**: a Vercel já manda, e repetir criaria dois lugares para manter. O teste garante que não foi duplicado.
- **CSP em `Content-Security-Policy-Report-Only`**, nunca em `Content-Security-Policy` por enquanto. A lista de imagens do CSP sai da mesma lista de hosts do `remotePatterns`, então um host novo de imagem não fica de fora de um e dentro do outro. Inclui `form-action https://accounts.google.com` (o navegador aplica `form-action` também ao redirecionamento do formulário de login) e `media-src https://cdn.pixabay.com` (o áudio do widget de "tocando agora").
- **`'unsafe-inline'` em `script-src` e `style-src`.** O Next injeta scripts inline para hidratar, e há centenas de `style=` no código. O jeito estrito (nonce) exige renderização dinâmica em toda página, o que jogaria fora o ISR da ADR-014.

## Consequências

### Positivo
- Quatro cabeçalhos passam a proteger o site sem risco de quebrar nada visual.
- O CSP mede antes de bloquear: se algo estiver fora da lista, só aparece como aviso.
- Um teste (`next.config.test.ts`) impede perder qualquer um deles sem querer.

### Negativo
- `'unsafe-inline'` enfraquece a proteção do CSP contra XSS: ele ainda limita de onde carregam scripts externos, imagens, formulários e iframes, mas não barra um script inline injetado.
- Em Report-Only o navegador não envia o relatório para lugar nenhum (não há `report-uri`/`report-to`), então as violações só aparecem no console do navegador. Quem quiser medir em produção precisa abrir o console, ou ter um endpoint de relatório.
- Qualquer host novo (outro CDN, outro provedor de imagem) precisa entrar na lista, senão aparece como violação (e, depois de enforçado, quebra).

### Neutro
- Ao mover o WordPress para o subdomínio do CMS (ECOSYSTEM.md, migração), basta trocar o host na lista de `next.config.ts`: `remotePatterns` e CSP mudam juntos.

## O que falta para fechar a #135

Passar o CSP de Report-Only para enforçado, depois de olhar o console de páginas reais em produção (login completo com Google, post com imagem e comentário, home) e ver zero violação. Nesta PR a verificação foi com Chrome headless local (home, post e login, zero violação), mas o fluxo completo do Google em produção só o dono consegue fazer.

## Alternativas consideradas

| Opção | Por que não |
|---|---|
| CSP enforçado já | Um CSP mal feito derruba o login do Google; a issue pede relatório primeiro |
| Nonce por requisição em `proxy.ts` | Obriga renderização dinâmica em todas as páginas, abrindo mão do cache da ADR-014 |
| Repetir o HSTS | A Vercel já manda; duplicar não protege mais |
| Cabeçalhos em `vercel.json` | O `next.config.ts` vale também no `next start` e dá para testar offline |
