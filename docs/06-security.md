# 06 — Security

## Security Objectives

Protect administrator access, guest identity documents, private booking access, payment integrity and production credentials.

## 1. Secret Management

Never commit, paste into documentation, or expose in screenshots/logs:

- Laravel `APP_KEY`
- database credentials
- Stripe secret key
- Stripe webhook secret
- SMTP credentials
- SSH credentials
- private booking access tokens

Production `.env` is server-only and must be preserved during deployment.

## 2. Admin Authentication and Authorization

- Admin login validates email/password.
- A successfully authenticated account must also have the `admin` role.
- Sanctum tokens protect admin APIs.
- Protected routes use `auth:sanctum` and `admin` middleware.
- Logout deletes the current access token.
- The frontend protected route is UX protection; Laravel authorization remains authoritative.

## 3. Private Booking Access

Public booking status does not use a customer account. Security relies on:

1. unique booking reference;
2. high-entropy random token;
3. stored SHA-256 token hash;
4. constant-time `hash_equals` comparison;
5. not-found response for missing/invalid token;
6. encrypted recoverable token field used only where the application needs to create private status links.

Never log or display private tokens unnecessarily.

## 4. Guest Identity Data

- Guest document number is encrypted at rest through the Eloquent cast.
- A deterministic hash supports lookup/deduplication.
- Raw document numbers and hashes are hidden from normal serialization.
- Uploaded document paths/hashes are hidden from normal serialization.
- Files should be stored on a non-public disk and downloaded only through authorized admin endpoints.

## 5. Upload Security

Booking application currently validates document uploads by allowed types (`pdf`, `jpg`, `jpeg`, `png`) and max size (10 MB). Maintain server-side MIME/size validation; do not trust filename extensions alone.

## 6. API Input Security

- Use Form Request validation for user-controlled payloads.
- Use enum/inclusion rules for statuses/plan types.
- Normalize emails/slugs/document input before domain processing.
- Use route-model binding with public UUID/slug identifiers where configured.
- Do not accept arbitrary client-calculated booking totals or paid balances as authoritative.

## 7. Rate Limiting

Current public/admin-sensitive endpoints include throttling such as:

- booking submission: 10/minute;
- public booking status: 30/minute;
- payment checkout: 10/minute;
- admin login: 5/minute.

Review these values based on production traffic and abuse patterns.

## 8. Payment Security

- Stripe Checkout handles card collection.
- Do not mark a payment successful from a browser redirect.
- Stripe webhook signature must validate against the configured webhook secret.
- Gateway events are deduplicated.
- Local payment/installment mutations use database locking/transactions where needed.
- Duplicate successful payments must be flagged for operational review rather than silently applied twice.

## 9. Database Security

- Use least-privilege database credentials.
- Keep production DB inaccessible from the public internet unless required and secured.
- Maintain foreign keys and indexes.
- Back up production data and test restore procedures.
- Never run destructive migrations without reviewed backups and release planning.

## 10. Frontend Security

- Never embed backend secrets in Vite variables; browser environment variables are public.
- Only public API base URLs/config belong in frontend environment values.
- Do not render raw HTML from untrusted guest input.
- Keep auth/token storage behavior consistent with the current application and minimize exposure.

## 11. Logging

Logs must not contain:

- passwords;
- card/payment secrets;
- private booking tokens;
- full identity documents;
- raw document numbers unless absolutely required and protected.

Use booking/payment references for operational correlation instead.

## 12. Production Checklist

Before each release:

- [ ] `.env` unchanged unless deliberately updated.
- [ ] HTTPS valid on frontend and API.
- [ ] CORS/config reviewed.
- [ ] Debug mode disabled.
- [ ] Stripe mode/keys/webhook endpoint verified.
- [ ] Storage permissions verified.
- [ ] Admin authorization test passed.
- [ ] Private booking token test passed.
- [ ] Database backup available before schema changes.
