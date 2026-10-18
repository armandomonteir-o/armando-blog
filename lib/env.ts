import { z } from "zod";

// Checks the environment variables when the app builds or starts (#134). Forgetting one on Vercel
// used to show up as a generic 500 in production (#91). Here the build fails and the message names
// every variable that is wrong, all at once. It never prints a value.
//
// It only CHECKS. The variables are still read where they are used, because a NEXT_PUBLIC_* one
// has to be written as a literal `process.env.NEXT_PUBLIC_X` for Next to inline it into the
// browser bundle; reading it through an object here would leave it undefined in the browser.

export interface EnvReport {
  errors: string[];
  warnings: string[];
}

export class EnvError extends Error {
  constructor(readonly problems: string[]) {
    super(
      [
        "Invalid environment variables:",
        ...problems.map((p) => `  - ${p}`),
        "Set them in .env.local (see .env.example) or in Vercel: Settings > Environment Variables.",
      ].join("\n")
    );
    this.name = "EnvError";
  }
}

type Source = Record<string, string | undefined>;

const FLAGS = ["NEXT_PUBLIC_ENABLE_NEWSLETTER", "NEXT_PUBLIC_ENABLE_NOTIFICATIONS"] as const;

const isHttpUrl = (v: string) => /^https?:\/\//i.test(v) && URL.canParse(v);

// "" and spaces count as not set: Vercel keeps a variable that was left blank.
function normalize(source: Source): Source {
  return Object.fromEntries(Object.entries(source).map(([k, v]) => [k, v?.trim() ? v : undefined]));
}

function required(min = 1) {
  return z
    .string({ error: "is missing" })
    .min(min, min > 1 ? `must have at least ${min} characters` : "is missing");
}

function schemaFor(env: Source) {
  const onVercel = Boolean(env.VERCEL_ENV);
  const production = env.VERCEL_ENV === "production";

  const wordpressUrl = required()
    .refine(isHttpUrl, "must be an http(s) URL")
    .refine((v) => !onVercel || /^https:/i.test(v), "must be https on a Vercel deploy");

  // The login, the comment writes and the revalidation hook only work with these. A preview or a
  // developer machine may not have them, so only a production deploy insists.
  const shape = {
    WORDPRESS_API_URL: wordpressUrl,
    AUTH_SECRET: production ? required(32) : z.string().optional(),
    AUTH_GOOGLE_ID: production ? required() : z.string().optional(),
    AUTH_GOOGLE_SECRET: production ? required() : z.string().optional(),
    WP_APP_USER: production ? required() : z.string().optional(),
    WP_APP_PASSWORD: production ? required() : z.string().optional(),
    REVALIDATE_SECRET: production ? required(32) : z.string().optional(),
  };
  return z.object(shape);
}

export function checkEnv(source: Source): EnvReport {
  const env = normalize(source);
  const errors: string[] = [];
  const warnings: string[] = [];

  const parsed = schemaFor(env).safeParse(env);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push(`${String(issue.path[0])}: ${issue.message}`);
    }
  }

  // These only warn: the code ignores a wrong value (a flag reads as off, the site URL falls back
  // to the default), so the site still works, but it is almost never what was meant.
  for (const flag of FLAGS) {
    const value = env[flag];
    if (value !== undefined && value !== "true" && value !== "false") {
      warnings.push(`${flag}: use "true" or "false" (anything but exactly "true" reads as off)`);
    }
  }
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl !== undefined && !isHttpUrl(siteUrl)) {
    warnings.push(
      "NEXT_PUBLIC_SITE_URL: must be an http(s) URL; the default address is used instead"
    );
  }

  return { errors, warnings };
}

export function assertEnv(source: Source = process.env): EnvReport {
  const report = checkEnv(source);
  if (report.errors.length > 0) throw new EnvError(report.errors);
  return report;
}
