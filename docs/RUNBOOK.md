# Runbook

Operational procedures for the Echelix Demo Hub. Aimed at whoever has
the keys when something needs to change or breaks.

---

## Table of contents

- [Deploying a code change](#deploying-a-code-change)
- [Applying a database migration](#applying-a-database-migration)
- [Rotating secrets](#rotating-secrets)
  - [`SESSION_SECRET`](#rotating-session_secret)
  - [`ADMIN_PASSWORD`](#rotating-admin_password)
  - [`SUPABASE_SERVICE_KEY`](#rotating-supabase_service_key)
  - [Resend API key](#rotating-resend-api-key)
  - [GitHub Personal Access Token](#rotating-the-github-pat-in-the-git-remote)
- [Managing bypass logins](#managing-bypass-logins)
- [Managing Microsoft hub eligibility](#managing-microsoft-hub-eligibility)
- [Debugging](#debugging)
  - [Storage RLS errors](#storage-rls)
  - [Auth errors](#auth-errors)
  - [Email delivery](#email-delivery)
  - [Hub doesn't show new demo](#hub-doesnt-show-new-demo)
  - [Build failures on Vercel](#build-failures-on-vercel)
- [Rolling back a bad deploy](#rolling-back-a-bad-deploy)

---

## Deploying a code change

1. Make changes locally, `npm run build` to confirm
2. Commit and `git push origin main`
3. Vercel auto-deploys (~90 seconds for a clean build)
4. Watch the build progress at <https://vercel.com/ryan8298/demo-hub/deployments>
5. If the deploy fails, the previous deploy stays live — you're safe

### If the change touches the database schema

Apply the migration in Supabase **before** the deploy goes live, otherwise
the new code will hit columns that don't exist yet.

```text
1. Open Supabase SQL Editor
2. Paste the contents of supabase/migrations/<latest>.sql
3. Run
4. Smoke-test using the snippet in the migration's header comment
5. Push the code commit
```

---

## Applying a database migration

All migrations live in `supabase/migrations/`, numbered by timestamp.
They're **idempotent** by convention (`IF NOT EXISTS`, `DROP POLICY
IF EXISTS`, etc.) so re-running is safe.

1. Supabase Dashboard → SQL Editor → New query
2. Paste the entire file contents
3. Run
4. Verify with the smoke test in the file header

We don't use the Supabase CLI for migrations because the projects are
small enough that manual application is faster than configuring CI to
push migrations. If that changes, set up `supabase db push` in a
GitHub Action.

---

## Rotating secrets

### Rotating `SESSION_SECRET`

> ⚠️ Rotating this invalidates **every** active admin and visitor
> cookie. Users will need to sign in again.

1. Generate a new secret: `openssl rand -base64 48`
2. Vercel → Settings → Environment Variables → edit `SESSION_SECRET`
3. Save → Vercel auto-redeploys
4. After deploy completes, all old cookies become invalid

Do this on a schedule (quarterly) or immediately if you suspect a leak.

### Rotating `ADMIN_PASSWORD`

1. Pick a new strong password (think 24+ random chars, password manager)
2. Vercel → Settings → Environment Variables → edit `ADMIN_PASSWORD`
3. Save → Vercel auto-redeploys
4. After deploy completes, the old password stops working

Active admin sessions are **not** invalidated because the cookie
doesn't carry the password — it carries an HMAC of `sub: 'admin'`.
To force admins to re-authenticate, also rotate `SESSION_SECRET`.

### Rotating `SUPABASE_SERVICE_KEY`

> ⚠️ Most disruptive rotation — affects all server-side DB access.

1. Supabase Dashboard → Project Settings → API → click "Reset" next to `service_role`
2. Copy the new key
3. Vercel → Settings → Environment Variables → update `SUPABASE_SERVICE_KEY`
4. Save → Vercel auto-redeploys
5. Verify by visiting `/admin` and confirming the dashboard loads

Do this immediately if the old key was ever pasted somewhere it shouldn't be.

### Rotating Resend API key

1. Resend Dashboard → API Keys → create new
2. Supabase Dashboard → Authentication → SMTP Settings → paste new key as Password
3. Save
4. (Optional) Delete old API key in Resend
5. Test by requesting an OTP

### Rotating the GitHub PAT in the git remote

The git remote currently embeds a PAT in the URL:
`https://ryan8298:ghp_…@github.com/…`. This is **not safe** — anyone
who sees `git remote -v` output gets repo write access.

Fix locally:

```bash
# 1. Switch to SSH (preferred — uses your SSH key, no token at all)
git remote set-url origin git@github.com:ryan8298/demo-hub.git

# Or 2. Re-add HTTPS without the token (will prompt for credentials)
git remote set-url origin https://github.com/ryan8298/demo-hub.git

# Then on GitHub: Settings → Developer settings → Personal access tokens →
# revoke the old ghp_… token
```

Verify: `git remote -v` should no longer show the token.

---

## Managing bypass logins

Bypass emails are defined in [`lib/bypass-logins.ts`](../lib/bypass-logins.ts).
To add, remove, or change one:

1. Edit the `BYPASS_LOGIN_MAP` object
2. Commit + push
3. Vercel deploys

There's no database involvement — they're hardcoded for speed.

**When to rotate** (i.e., change to different emails):

- If the current emails leak publicly (someone screenshots a live demo)
- After a sales rep with knowledge of them leaves
- Periodically as security hygiene

Currently active:

| Email | Destination |
| --- | --- |
| `client@echelix.com` | `/customer/hub` |
| `microsoft@echelix.com` | `/microsoft/hub` |
| `admin@echelix.com` | `/admin` |

---

## Managing Microsoft hub eligibility

Real Microsoft employees pass via the `@microsoft.com` rule —
hardcoded, no config needed.

For testing with non-Microsoft emails, set the `MICROSOFT_TEST_EMAILS`
env var in Vercel:

```text
# Exact emails:
MICROSOFT_TEST_EMAILS=ryan@echelix.app,partner@example.com

# Whole domains (prefix with @):
MICROSOFT_TEST_EMAILS=@echelix.app

# Mixed:
MICROSOFT_TEST_EMAILS=@echelix.app,bob@another.com
```

Leave **unset / empty** for production behavior (only `@microsoft.com`
plus the `microsoft@echelix.com` bypass).

---

## Debugging

### Storage RLS

**Symptom:** `Upload failed: new row violates row-level security policy`

**Most likely cause:** `SUPABASE_SERVICE_KEY` in Vercel is actually the
`anon` key by accident.

**Diagnosis:**

1. Copy the value of `SUPABASE_SERVICE_KEY` from Vercel
2. Paste into <https://jwt.io>
3. Decoded payload should contain `"role": "service_role"`. If it says
   `"role": "anon"`, that's the bug.

**Fix:** Update the env var with the real service-role key from
Supabase → Settings → API → "service_role" → Reveal → Copy.

If the key is correct but uploads still fail, verify the storage
policies migration was applied:

```sql
SELECT policyname FROM pg_policies
WHERE schemaname='storage' AND tablename='objects'
  AND policyname LIKE 'demo_assets%';
-- expect 4 rows
```

If fewer than 4, apply
`supabase/migrations/20260528000003_demo_assets_write_policies.sql`.

### Auth errors

| Error in modal | Meaning |
| --- | --- |
| "Couldn't send code" | Supabase signInWithOtp failed — check Resend status + Supabase auth logs |
| "Too many code requests" | Hit the rate limiter — 5 sends per IP per 10 min |
| "Token has expired or is invalid" | Either the code is wrong, OR the magic link in the email was pre-clicked by a security scanner (delete the URL from the email template — see below) |
| "Cannot coerce the result to a single JSON object" on edit | Demos table missing service_role policy — apply migration `20260528000004` |

**The single most common auth gotcha:** corporate email security
(Microsoft Defender Safe Links, Mimecast, Proofpoint) pre-clicks the
magic link in OTP emails, consuming the token before the user types
the code. Fix: in Supabase → Authentication → Email Templates → Magic
Link, ensure `{{ .ConfirmationURL }}` is **NOT** present in the
template body. Use only `{{ .Token }}`.

### Email delivery

**Symptom:** Code request appears to succeed but no email arrives.

Check in order:

1. **Spam folder** — first-time senders always land there
2. **Resend dashboard** → Emails — was the email actually sent? Any bounce?
3. **Supabase Auth Logs** — was the OTP generated?
4. **Free-tier rate limit** — Resend free is 100 emails/day. Bump to
   Pro ($20/mo, 50,000/mo) before public traffic.

### Hub doesn't show new demo

Hubs are ISR-cached at the edge for 60 seconds. New demos call
`revalidatePath('/customer/hub')` and `/microsoft/hub` so they should
appear immediately, but if you're hitting a stale cache:

1. Hard-refresh the hub page (Cmd+Shift+R)
2. Confirm the demo's `audience` array contains the right hub
3. Confirm `featured`, `industry`, and `tags` look right in `/admin`
4. Wait 60 seconds and retry — ISR will refresh on the next request

### Build failures on Vercel

The most common causes, in rough order of frequency:

| Error | Cause | Fix |
| --- | --- | --- |
| `Missing required env var` | A required env var isn't set in Vercel | Check `.env.example`, add the var |
| `useSearchParams() should be wrapped in a suspense boundary` | Next 16 strict mode | Wrap the offending page in `<Suspense>` |
| `Cannot find module '../../../app/api/auth/route.js'` | Stale `.next/dev/types` cache | Delete the `.next` directory; rebuild |
| `@import rules must precede all rules` | CSS `@import` after another rule | Move `@import "tailwindcss"` to the top of `globals.css` |

---

## Rolling back a bad deploy

If a deploy ships a regression:

1. Vercel Dashboard → Deployments
2. Find the **previous green deploy** (the one before the bad one)
3. Click the **⋯** menu → **Promote to Production**
4. The previous build becomes live immediately (no rebuild needed —
   Vercel keeps the artifact)

Then fix the bug on a local branch, push, redeploy.

Database migrations are **not** rolled back automatically. If the
bad deploy depended on a destructive migration, you need to write a
reverse migration manually.
