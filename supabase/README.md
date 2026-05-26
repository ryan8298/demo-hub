# Echelix Demo Hub — Supabase

## Migrations

Files in `migrations/` are listed in **lexicographic order** — Supabase CLI
applies them in that order, and so should you when running them manually.

| File | Purpose |
| ---- | ------- |
| `20251001000000_add_industry_column.sql` | Adds the `industry` text column + index used by the hub tile badges. |
| `20260526000000_enable_rls.sql` | Locks down `demos` and `visitor_sessions` with RLS. **Required before going live on echelix.app.** |

### Running them

The lowest-friction path is the Supabase dashboard:

1. Open your project → **SQL Editor** → **New query**
2. Paste the contents of the migration
3. Run

The migrations are written to be idempotent (`IF NOT EXISTS`, `DROP POLICY IF EXISTS …`)
so re-running is safe.

### Verifying RLS landed

In the dashboard's **Authentication → Policies** tab you should see:
- `demos`: RLS **enabled**, 1 policy (`anon can read demos`).
- `visitor_sessions`: RLS **enabled**, 0 policies.

To smoke-test from the command line, replace the placeholders and run:

```bash
curl -s "https://<project>.supabase.co/rest/v1/visitor_sessions?select=*" \
  -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"
# Should return: []   (anon cannot see any rows)

curl -s "https://<project>.supabase.co/rest/v1/demos?select=id" \
  -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"
# Should return: [{id: "..."}, ...]   (anon CAN read demos)

curl -s -X POST "https://<project>.supabase.co/rest/v1/demos" \
  -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>" \
  -H "Content-Type: application/json" \
  -d '{"title":"hack","demo_url":"x","slug":"x","audience":["customer"]}'
# Should return: 401/403, NOT a successful insert.
```

If the third request succeeds, RLS is **not** on yet — re-run the migration.

## Environment variables (server)

| Var | Purpose | Where |
| --- | ------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Vercel + .env.local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-side anon key | Vercel + .env.local |
| `SUPABASE_SERVICE_KEY` | Server-only service role key | Vercel + .env.local (never `NEXT_PUBLIC_`) |
| `ADMIN_PASSWORD` | Single shared admin password | Vercel + .env.local |
| `SESSION_SECRET` | ≥32 chars, random — used to sign admin + visitor cookies | Vercel + .env.local |

Generate a strong `SESSION_SECRET`:
```bash
openssl rand -base64 48
```
