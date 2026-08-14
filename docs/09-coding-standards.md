# 08 — Coding Standards

## 1. Source of Truth

Always inspect the current repository before changing an existing feature. Do not reconstruct uncommitted or failed code from memory.

## 2. Architecture

- Keep React and Laravel separated and API-driven.
- Laravel owns business logic and authoritative state.
- React owns presentation, local UI state and API interaction.
- Do not duplicate availability, pricing or payment-summary calculations in React.

## 3. Backend Standards

### Controllers

- Validate through Form Requests when payloads are non-trivial.
- Keep controllers focused on HTTP orchestration.
- Delegate multi-step domain logic to services.
- Return Resources/consistent JSON structures where already established.

### Services

- Use transactions for multi-record state transitions.
- Use locking when concurrent payment/assignment processing can cause races.
- Keep one clear business responsibility per service.
- Reuse existing services rather than introducing parallel logic.

### Models

- Define explicit relationships.
- Use casts for money/date/enum/encrypted fields where appropriate.
- Hide sensitive attributes from serialization.
- Preserve existing route-model binding behavior.

### Database

- Do not invent columns or relationships.
- Add a migration only when the current schema truly requires it.
- Never edit an already-run production migration to change schema; add a new migration.
- Preserve foreign keys and useful indexes.
- Avoid duplicate denormalized history tables unless a demonstrated reporting/performance need requires one.

## 4. Frontend Standards

- Preserve current routing/layout behavior unless the feature requires a change.
- Match filename/import capitalization exactly; production is Linux.
- Reuse existing UI patterns/components where practical.
- Never replace live API data with fake/static data for production features.
- Keep API calls in the established API/client pattern.
- Render server-derived financial and availability values rather than recalculating them inconsistently.

## 5. Naming

- PHP classes: PascalCase.
- PHP methods/variables: camelCase.
- React components: PascalCase.
- JS functions/variables: camelCase.
- Database tables: plural snake_case.
- Database columns: snake_case.
- Routes/API paths: follow the existing REST naming style.

## 6. Status Handling

Use canonical backend values. Never merge booking status and payment status.

Booking status examples:

```text
pending_review
awaiting_payment
confirmed
rejected
payment_expired
cancelled
checked_in
checked_out
```

Financial status examples:

```text
unpaid
partially_paid
paid
overdue
```

## 7. Error Handling

- Validate early.
- Return actionable validation errors.
- Report unexpected exceptions.
- Do not catch exceptions merely to hide failures.
- Notification failures should not undo already-committed booking state unless the business transaction explicitly depends on delivery.

## 8. Security

- No secrets in source.
- No private tokens in examples/logs.
- Admin routes stay protected.
- Guest documents stay private.
- Stripe webhook remains authoritative.

## 9. Required Verification Workflow

For backend changes:

```bash
php -l path/to/changed/file.php
php artisan route:list
php artisan test
```

Run targeted tests/endpoint checks in addition to the broad commands.

For frontend changes:

```bash
npm run lint
npm run build
```

Then:

```bash
git diff
git status
```

Commit only working, reviewed changes.

## 10. Change Scope

When fixing one issue:

- do not redesign unrelated components;
- do not remove working logic;
- do not replace a large current file with an older/simplified version;
- make the smallest architecture-consistent change that fully solves the requirement.
