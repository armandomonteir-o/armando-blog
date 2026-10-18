# Security policy

This is a personal blog, maintained by one person in their spare time. The repository is public for reading only; it is not open source and does not take outside contributions (see [ADR-019](./docs/adr/ADR-019-repositorio-publico-sem-licenca-aberta.md)). A security report is the one kind of outside message that is welcome.

## How to report a vulnerability

Use GitHub's private reporting: on the repository page, **Security → Report a vulnerability**. Only the maintainer sees it.

**Do not open a public issue or pull request about a vulnerability**, and do not post details anywhere public before it is fixed.

If the "Report a vulnerability" button is not there, the feature is not turned on yet. In that case, open a public issue that says only "I have a security report, please enable private reporting", with no details, and wait for an answer.

A good report has: what you found, the URL or route, the steps to reproduce it, and what an attacker gains. A working proof beats a long description.

## In scope

The published site at [armando-blog.vercel.app](https://armando-blog.vercel.app) and the code in this repository, in particular:

- the comments route (`/api/comments`);
- the Google sign-in (`/api/auth/*`, the session);
- the profile and avatar upload (`/api/profile`, `/api/profile/avatar`);
- the revalidation route (`/api/revalidate`);
- the search route (`/api/search`);
- anything that leaks a secret, lets someone act as another user, or lets someone publish without moderation.

## Out of scope

- WordPress itself and third-party plugins: report them to their authors. Flaws in the code of this blog's own WordPress theme and plugin live in the separate `blog-cms` repository and can be reported the same way.
- Volumetric denial of service (flooding the site with traffic).
- Automated scanner output with no proof that it can be exploited.
- The Content-Security-Policy being report-only and allowing `'unsafe-inline'`: both are known and explained in ADR-017 below.

## What to expect

One person maintains this, so there is no service level and no bug bounty. The aim is to read a report within a few days, tell you whether it is a real issue, and fix real ones as soon as the maintainer reasonably can, with credit if you want it. If a report is not going to be fixed, you will be told why.

## Defenses already in place

- Security headers (`nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`), and a Content-Security-Policy that is **report-only for now**, not enforced yet: [ADR-017](./docs/adr/ADR-017-cabecalhos-de-seguranca-e-csp-em-modo-relatorio.md).
- A rate limit at the Vercel edge on the write and search routes (429 above 30 requests per minute per IP): [ADR-018](./docs/adr/ADR-018-limite-de-requisicoes-na-borda-da-vercel.md).
- Every comment waits for moderation before it appears ([`docs/ECOSYSTEM.md`](./docs/ECOSYSTEM.md)), and sign-in is only through Google, with no passwords stored: [ADR-009](./docs/adr/ADR-009-comment-auth-strategy.md).
- Secrets live in environment variables, never in the repository. Dependencies are watched by Dependabot and `npm audit` in CI ([`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md)).

Where each piece is hosted is in [`docs/ECOSYSTEM.md`](./docs/ECOSYSTEM.md).
