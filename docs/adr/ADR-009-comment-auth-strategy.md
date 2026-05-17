# ADR-009 — Comment Authentication Strategy

**Status:** Accepted  
**Date:** 2026-05-17  
**Issue:** #32

---

## Context

The blog needed an authenticated comment system. The key constraints were:

1. **No user passwords stored** — the auth system uses Google OAuth only (via Auth.js v5). There are no local user accounts or passwords in the database.
2. **WordPress is the CMS** — comments must live in WordPress (via WPGraphQL) so Armando can moderate them in WP Admin.
3. **WPGraphQL mutations require authentication** — by default, `createComment` mutation requires admin credentials to set comment status to `APPROVE` (skip moderation queue).
4. **Client identity must not be trusted** — the browser should never be able to impersonate another user or bypass auth.

---

## Decision

**Two-credential system:**

| Credential | What it is | Who knows it | Used for |
|---|---|---|---|
| Google OAuth session | Signed JWT from Auth.js | Server only (via `auth()`) | Identifying *who* is commenting |
| WP Application Password | `WP_APP_USER` + `WP_APP_PASSWORD` env vars | Server only | Creating the comment in WordPress with `APPROVE` status |

**Flow:**

```
Browser → POST /api/comments { postId, content }
             ↓
        auth() → validate session (is user logged in via Google?)
             ↓
        createWPComment({
          commentOn: postId,
          content,
          author: session.user.name,       ← from Google
          authorEmail: session.user.email, ← from Google
          status: APPROVE
        })
             ↓
        Authorization: Basic base64(WP_APP_USER:WP_APP_PASSWORD)
             ↓
        WordPress stores comment with Google identity as author
```

**Why the server is the chokepoint:**
The client only sends `{ postId, content }`. It cannot send its own name or email — those come exclusively from `session.user`, which is a signed server-side session. This prevents any identity spoofing.

---

## Why not alternatives

### Option A — Let users comment unauthenticated
Rejected: spam, no identity, no moderation control.

### Option B — Store WP user accounts for each Google login
Rejected: requires creating WP users programmatically, mapping Google accounts to WP accounts, and maintaining that mapping. Complexity without benefit since Armando only needs author name/email for display.

### Option C — Use the WP REST API instead of WPGraphQL for comments
Rejected: ADR-004 established WPGraphQL as the data layer. Mixing REST and GraphQL would split the data layer with no gain.

### Option D — Use a separate comment service (Disqus, Giscus, Utterances)
Rejected: ADR-003 established WordPress as the CMS. Comments belong in WP Admin where Armando can moderate them alongside posts. No third-party dependency needed.

---

## Consequences

- **Gravatar avatars** — Comment authors are identified by email. WordPress uses Gravatar for comment author avatars. The `secure.gravatar.com` domain must be in `next.config.ts` `remotePatterns`. Google profile photos do NOT appear on comments (only on the Header, which reads from `session.user.image`).
- **Auto-approved comments** — All comments submitted via the form bypass the WP moderation queue (status: APPROVE). If spam becomes an issue, this can be changed to `HOLD` and moderated in WP Admin.
- **No anonymous comments** — Intentional. Login required to comment. The `PostCommentsSection` shows a login prompt to logged-out users.
- **Application Password lives in `.env.local`** — Never committed to git. Must be set in Vercel environment variables for production.

---

## Files

| File | Role |
|---|---|
| `lib/graphql/client.ts` | `wpMutation()` — authenticated GraphQL client using Application Password |
| `lib/graphql/mutations/comments.ts` | `createWPComment()` — the `createComment` GQL mutation |
| `app/api/comments/route.ts` | POST endpoint — validates session via `auth()`, calls `createWPComment()` |
| `components/content/single-post/PostCommentsSection.tsx` | Client component — shows form (logged in) or login prompt (logged out) |
| `next.config.ts` | `secure.gravatar.com` added to `remotePatterns` |
| `auth.ts` | Auth.js v5 config — Google provider, `/login` as sign-in page |
