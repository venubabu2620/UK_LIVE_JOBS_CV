# Production deployment checklist

## Secrets
Configure these as server-side secrets in your deployment provider:
- DATABASE_URL
- NEXTAUTH_SECRET
- ADZUNA_APP_ID
- ADZUNA_APP_KEY
- GEMINI_API_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_RESUME_BUCKET
- RESEND_API_KEY
- EMAIL_FROM
- ADMIN_BOOTSTRAP_TOKEN
- ADMIN_EMAIL

## Hourly sync
Use a permitted scheduler/cron to invoke the job sync. Do not expose an unauthenticated public endpoint for syncing.

## Cloudflare
Follow the current Cloudflare Next.js Workers documentation and run its compatibility checks before deploying. Cloudflare's current recommendation is vinext for new Next.js projects.
