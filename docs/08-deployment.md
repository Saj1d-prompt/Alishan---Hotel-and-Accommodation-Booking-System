# 07 — Deployment Guide

## Production Topology

| Component | Production target |
|---|---|
| React static frontend | `alishan.lt` |
| Laravel REST API | `api.alishan.lt` |
| Hosting | Hostinger |
| PHP | 8.3 |
| Database | MySQL |

Known Hostinger paths used by the project:

```text
/home/u469949876/domains/alishan.lt/public_html
/home/u469949876/domains/api.alishan.lt/public_html
/home/u469949876/alishan-app/backend
```

Git branch used for releases: `main`.

## Deployment Principles

1. Local code/build/tests first.
2. Review the Git diff.
3. Back up production data before risky schema changes.
4. Preserve production `.env`.
5. Never expose secrets in commands/screenshots/docs.
6. Never destroy existing `.htaccess` behavior accidentally.
7. Deploy only an explicitly approved release.

## Frontend Release

From the current source:

```bash
cd frontend
npm ci
npm run lint
npm run build
```

Verify `dist/` locally, then publish its contents to the frontend web root according to the current Hostinger deployment method.

Do not upload `src/`, local `.env`, or `node_modules` as the production static website.

## Backend Release

Typical safe sequence from the Laravel application directory:

```bash
git status
git pull --ff-only origin main
composer install --no-dev --optimize-autoloader
php artisan config:clear
php artisan route:list
```

Before running migrations:

```bash
php artisan migrate:status
```

Review every pending migration and ensure a backup exists. Then, only when approved:

```bash
php artisan migrate --force
```

Use the project’s current cache strategy after verifying environment/config values:

```bash
php artisan config:cache
php artisan route:cache
```

If route caching is incompatible with a future route definition, resolve that in source rather than ignoring the failure.

## Storage

Verify Laravel writable directories and document storage configuration. Guest identity documents must not become publicly browsable merely for deployment convenience.

## Scheduler

The repository schedules:

```text
payments:send-reminders
```

every minute with overlap prevention. Production still needs the standard Laravel scheduler invocation, normally once per minute, configured through the hosting environment.

Example form (adapt path to the production PHP binary/application):

```bash
php /home/u469949876/alishan-app/backend/artisan schedule:run
```

Do not copy an example PHP binary/path blindly; verify it on Hostinger.

## Queue

The backend uses database queue capabilities. Confirm whether each notification is synchronous or queued and ensure production queue execution matches the actual notification implementation before relying on asynchronous delivery.

## Stripe Production Verification

- Correct live/test mode for intended release.
- `STRIPE_SECRET` configured server-side.
- Webhook secret configured server-side.
- Webhook endpoint targets the production API endpoint.
- HTTPS enabled.
- One controlled payment verifies Checkout → webhook → local payment/installment → booking state.
- Duplicate event retry remains idempotent.

## Post-Deployment Checks

- [ ] `alishan.lt` loads.
- [ ] Public locations load from live API.
- [ ] Location/room offers return correctly.
- [ ] Booking submission works.
- [ ] Private booking status works with valid token and fails with invalid token.
- [ ] Admin login works.
- [ ] Admin booking list/details work.
- [ ] Document download/verification works for authorized admin.
- [ ] Stripe Checkout can be initiated for an eligible booking.
- [ ] Webhook changes local payment state.
- [ ] Frontend console has no production-breaking errors.
- [ ] Laravel logs show no release errors.

## Rollback

Code rollback and database rollback are separate decisions. Never run `migrate:rollback` in production automatically. Assess whether the migration is safely reversible and whether later production data depends on it. Prefer a forward-fix migration when rollback would destroy valid data.
