# 00 — Project Roadmap

**Project:** Alishan Accommodation Management System  
**Product type:** Commercial accommodation-management platform  
**Primary market:** Lithuania  
**Architecture:** React frontend + Laravel REST API + MySQL

## Guiding Principle

Deliver the system in small, verifiable increments. The current repository is always the implementation source of truth; documentation must follow working code and explicit business decisions.

## Phase 1 — Foundation

**Status: Implemented in stable baseline**

- React/Vite frontend and Laravel 12 backend separated by REST APIs.
- MySQL schema for locations, properties, rooms, contracts, pricing, guests, bookings and payments.
- Sanctum-based admin authentication.
- Admin-role restriction.
- Seed data and public catalogue foundation.

## Phase 2 — Public Catalogue and Availability

**Status: Implemented**

- Public locations listing.
- Property/location details.
- API-driven room-type offers.
- Stay-term selection.
- Backend-authoritative pricing and availability.
- Long-term and short-term stay-period resolution.

## Phase 3 — Booking Application

**Status: Implemented**

- No customer account requirement.
- Guest/application form.
- Passport/document upload.
- Booking reference generation.
- Secure private booking access token.
- Pending-review state.
- Booking submitted notification.

## Phase 4 — Admin Review

**Status: Implemented**

- Protected admin login.
- Booking list/search/status filter/pagination.
- Booking details/review.
- Guest-document verification/rejection.
- Physical room assignment.
- Room conflict validation.
- Approval/rejection workflow.

## Phase 5 — Payments

**Status: Implemented; operational verification ongoing**

- Full-payment plan.
- Two-part installment plan.
- Stripe Checkout session creation.
- Stripe webhook signature validation.
- Gateway event idempotency support.
- Payment-to-installment application.
- Booking financial summary: unpaid, partially paid, paid, overdue.
- Payment receipt notification.
- Remaining-payment reminder command/schedule.

## Phase 6 — Operational History and Reporting

**Status: Next major admin capability**

- Physical Rooms operational view.
- Current/upcoming room assignment visibility.
- Room History based on existing booking assignments.
- Booking History report/archive page.
- Server-side search, filters and pagination.
- Stay-state derivation (upcoming/current/past) without replacing booking status.

## Phase 7 — Admin Management Expansion

**Status: Planned**

- Property management UI/API.
- Room management operations.
- Guest management improvements.
- Payment/reconciliation operations.
- Reports.
- Settings.

Implementation should begin only after the exact product requirements for each module are agreed.

## Phase 8 — Production Hardening

**Status: Continuous**

- Automated test coverage.
- Backup and restore verification.
- Queue/scheduler reliability.
- Monitoring/log review.
- Payment reconciliation procedure.
- Security review and dependency updates.
- Deployment checklist discipline.

## Release Discipline

For each feature:

1. Inspect current repository.
2. Design the smallest API/data change.
3. Implement backend incrementally.
4. Run PHP syntax checks and relevant tests.
5. Run `php artisan route:list`.
6. Test endpoint locally.
7. Implement corresponding frontend only after backend behavior is confirmed.
8. Test UI locally.
9. Run `npm run lint` and `npm run build`.
10. Review `git diff`.
11. Commit only when the increment works.
12. Deploy only as an explicit release action.
