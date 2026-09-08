# UK Live IT Jobs — V1

Production-oriented Next.js application for a UK IT job discovery and truthful AI resume optimization service.

## Current V1

- Modern professional desktop-first UI
- Credentials auth + protected dashboard
- Prisma/PostgreSQL data model
- Adzuna UK IT job ingestion
- Adzuna IT category filtering + local IT confidence classifier
- Exact keyword-in-job-title search
- Hourly sync entry point (`npm run sync:jobs`)
- Private Supabase resume storage integration
- PDF/DOCX text extraction
- Gemini resume optimization adapter
- Match score / matched / missing keywords / changes
- Preview-only optimized resume
- PDF and DOCX export
- Admin bootstrap and basic admin dashboard
- Basic SEO metadata
- Server-only provider secrets

## Before public launch

1. Rotate any API credentials previously pasted into chat.
2. Create production Supabase project and private `private-resumes` bucket with appropriate policies.
3. Configure PostgreSQL and run migrations.
4. Add Adzuna credentials to server secrets.
5. Add Gemini credentials to server secrets and confirm current model/quota/terms.
6. Configure Resend and a verified sending domain.
7. Configure Cloudflare deployment.
8. Add a secure scheduled job runner that executes `syncAdzuna()` hourly, respecting Adzuna rate limits/terms.
9. Configure `NEXTAUTH_SECRET`.
10. Bootstrap the first admin using the protected endpoint, then remove/rotate `ADMIN_BOOTSTRAP_TOKEN`.
11. Add production privacy policy, terms, cookie/consent handling as legally appropriate.
12. Run `npm run typecheck` and `npm run build`.
13. Perform security, accessibility, source-license/aggregation-terms and load testing before launch.

## Setup

```bash
cp .env.example .env.local
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Cloudflare

Cloudflare currently recommends its vinext path for new Next.js applications on Workers. This repository remains standard Next.js so it can be validated locally first; follow Cloudflare's current deployment guide before production deployment.

## Important

This repository does not contain API keys. Put all provider secrets in deployment environment variables.

Adzuna's API requires an app ID and app key and provides a UK jobs endpoint. Its category API includes an `IT Jobs` category. See official Adzuna documentation.

The product does not claim instant employer updates. It shows source synchronization/freshness timestamps. The scheduled sync frequency must comply with the provider's current rate limits and terms.
