# 02 — Software Requirements Specification

## 1. Functional Requirements

### 1.1 Public Catalogue

The system shall:

- Return active accommodation locations.
- Show location details and images.
- Return room-type offers for a selected property/stay term.
- Calculate pricing using active property-contract and price-list data.
- Calculate availability from real physical-room inventory and blocking bookings.
- Keep pricing and availability authoritative in Laravel.

### 1.2 Booking Application

The system shall:

- Accept booking applications without customer registration/login.
- Require property, room type, stay term, occupants and guest contact details.
- Require check-in/check-out dates for short-term stays.
- Require guest identity/residence document information and an uploaded proof file according to the active UI/business wording.
- Require privacy/accuracy acceptance.
- Reject an application when the selected room type has no current valid inventory for the requested stay.
- Generate a unique booking reference.
- Generate a cryptographically strong private booking token and persist only protected forms needed by the application.
- Store the booking initially as `pending_review`.
- Avoid assigning a physical room during public application submission.

### 1.3 Secure Booking Status

The system shall:

- Resolve booking status by booking reference + private access token.
- Return not-found behavior when the token is missing or invalid.
- Never expose internal database IDs as the public access mechanism.
- Return booking, property, room type, contract, document and financial status data appropriate for the public guest.

### 1.4 Admin Authentication

The system shall:

- Authenticate administrators by email/password.
- Reject valid non-admin accounts from the admin area.
- Issue Sanctum tokens for the admin panel.
- Protect admin routes with authentication and admin authorization middleware.
- Allow the current token to be revoked on logout.

### 1.5 Booking Review

The system shall:

- List real bookings with search, status filter and pagination.
- Show detailed booking/guest/property/document information.
- Require verified guest documentation before approval.
- Require an eligible physical room before approval.
- Check room property, room type, allowed floors, active status, capacity and overlapping booking conflicts.
- Approve only bookings in `pending_review`.
- Reject only bookings in `pending_review`.
- Record reviewer and review timestamp.

### 1.6 Payment Plan

On approval, the system shall:

- Use the system-calculated estimated total as the payable booking total unless the business rules are deliberately changed.
- Support `full` payment.
- Support `partial` payment as two installments.
- Require the first partial amount to be greater than zero and less than the full booking total.
- Set due dates using Lithuanian business timezone expectations.
- Move the booking to `awaiting_payment`.

### 1.7 Stripe Payments

The system shall:

- Start Checkout only for a booking resolved by a valid private token.
- Create a local payment record tied to the relevant installment.
- Use Stripe Checkout for payment collection.
- Use idempotency keys for Checkout creation.
- Validate Stripe webhook signatures.
- Treat the webhook as authoritative for confirmed payment.
- Record processed gateway events to support idempotent webhook handling.
- Apply successful payment to the correct installment without double-reducing the booking balance.
- Flag duplicate successful transactions that require manual refund/reconciliation review.

### 1.8 Financial Summary

The backend shall derive:

- Booking total.
- Paid amount.
- Outstanding amount.
- Payment state (`unpaid`, `partially_paid`, `paid`, `overdue`).
- Next pending installment and remaining amount.

### 1.9 Notifications

The system shall support:

- Booking submitted email.
- Booking approved email.
- Booking rejected email.
- Successful payment receipt email.
- Remaining-balance reminder email for eligible second installments approaching due time.

Notification failure must not roll back an already valid booking state transition.

### 1.10 Physical Rooms / Room History

The admin system shall provide an operational physical-room view showing current state and assigned booking information. Room History shall query normal booking/booking-item relationships rather than copy records into a second history table.

### 1.11 Booking History

The admin system shall provide an archive/reporting page containing current and historical bookings, server-side search/filtering and pagination. Booking History shall not replace the operational Bookings review page.

## 2. Non-Functional Requirements

### Security

- HTTPS in production.
- No committed secrets.
- Admin APIs authenticated and authorized.
- Secure token comparison for private booking access.
- Private guest documents not exposed as public files.
- Input validation at API boundaries.
- Stripe signature verification.

### Reliability

- Database transactions for multi-record booking/review/payment state transitions.
- Webhook idempotency.
- Foreign-key constraints.
- Production database backups.
- Error logging and recoverable failure handling.

### Performance

- Eager-load relationships required by list/detail resources.
- Avoid N+1 query patterns.
- Paginate large admin datasets.
- Use indexed filter/search columns where appropriate.
- Prefer server-side reporting filters over loading entire datasets into React.

### Maintainability

- Preserve frontend/backend separation.
- Keep controllers reasonably small.
- Put reusable domain logic in services/models/resources.
- Do not duplicate financial or availability logic in React.
- Keep database migrations append-only after production release.

### Compatibility

- Local development on Windows is supported.
- Production is Linux; import/file-name capitalization must match exactly.
