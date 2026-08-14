# 03 — Business Rules

## 1. Product and User Rules

1. Public customers do not have accounts in v1.
2. Only administrators authenticate.
3. A public customer accesses a booking through the booking reference and private token.
4. Booking status and payment status are distinct concepts.

Example:

```text
Booking Status: confirmed
Payment Status: partially_paid
```

## 2. Property and Inventory Rules

1. A property belongs to one city; a city belongs to one country.
2. A property has physical rooms.
3. A physical room belongs to one property and one room type.
4. A room may contain beds; existing bed support remains part of the schema even if current operational flows mostly assign rooms.
5. Inactive properties, room types, contracts, prices or rooms must not be offered as available inventory.
6. Internal IDs must not be changed merely to change public display order.

## 3. Current Business Data

### Pylimo gatvė 63

- 25 physical rooms.
- Public display order: first.
- Long-term and short-term.
- Short-term physical rooms limited to allowed floors configured by the property contract (current business expectation: floors 3 and 4).
- Long-term rates per person/month: 1 person €299, 2 people €199, 3 people €179.
- Short-term rates per person/night: 1 person €25, 2 people €20, 3 people €15.
- Utilities excluded.

### Latgalių

- 9 physical rooms.
- Long-term only.
- Rates per person/month: 1 person €220, 2 people €180, 3 people €160.
- Utilities excluded.

### Šeškinės

- 14 physical rooms.
- Long-term only.
- Rates per person/month: 1 person €160, 2 people €190, 3 people €170, 4 people €150.
- Utilities included.

**Total active physical rooms represented by current business requirements: 48.**

> Seed data and production database values must remain the implementation source of truth; documentation does not replace database verification.

## 4. Pricing Rules

1. Rates are **per person**.
2. Room capacity is the maximum occupant count.
3. Price is based on actual occupants and resolved duration units.
4. Prices are stored in `price_lists` and tied to a property contract + room type.
5. Currency is currently EUR.
6. Charge basis is currently `per_person`.
7. Long-term business period is 1 September through 31 August.
8. Short-term requires explicit check-in and check-out dates and follows contract limits.

## 5. Booking Application Rules

1. Public submission creates a booking in `pending_review`.
2. No physical room is reserved/assigned during the initial public application.
3. The requested room type must have actual available inventory for the requested stay before a pending application is accepted.
4. Occupants cannot exceed the selected room type capacity.
5. Current request validation limits occupants to 1–4.
6. Guest identity is deduplicated using a normalized, hashed document number while the actual document number is stored encrypted.
7. A private random access token is generated for the booking.
8. Guest document upload is required for the application workflow.

## 6. Admin Review Rules

1. Only a `pending_review` booking can be approved/rejected.
2. Required guest documentation must be verified before approval.
3. The selected physical room must:
   - belong to the booking property;
   - match the requested room type;
   - be active;
   - satisfy capacity;
   - satisfy property-contract floor restrictions;
   - have no overlapping booking in a blocking status.
4. Blocking statuses for room conflicts currently include:
   - `awaiting_payment`
   - `confirmed`
   - `checked_in`
5. Approval assigns `booking_items.room_id` and transitions to `awaiting_payment` in the same transactional workflow.
6. Rejection records reviewer, time and reason and removes any approval-stage installments.

## 7. Payment Plan Rules

1. Full payment creates one installment for the full booking amount.
2. Partial payment creates exactly two installments:
   - initial payment;
   - remaining balance.
3. Initial partial amount must be > 0 and < booking total.
4. Due-date inputs are date-based and converted using the application’s Lithuanian business-time expectations.
5. Installments track amount, paid amount, status, due time and paid time.

## 8. Payment Rules

1. Stripe webhook confirmation is authoritative; a frontend redirect is not sufficient proof of payment.
2. A Payment record and PaymentInstallment are separate but related.
3. Gateway events must be idempotent by gateway + event ID.
4. A successful transaction must not reduce the same installment balance twice.
5. Duplicate successful money received after an installment is already satisfied must be flagged for manual review/refund handling.
6. Financial summary is calculated by the backend.

## 9. Financial State Rules

For the backend financial summary:

- `paid`: booking total > 0 and outstanding amount is effectively zero.
- `overdue`: a pending installment with remaining balance is past due.
- `partially_paid`: some money has been applied and a balance remains.
- `unpaid`: no applied payment and the booking is not overdue.

## 10. Confirmation Rule

According to the current payment workflow, the first required successful installment can confirm the booking. A two-part plan may therefore have:

```text
booking_status = confirmed
payment_status = partially_paid
```

The remaining installment continues to be tracked separately.

## 11. History Rules

1. Do not create a duplicate `booking_histories` table for reporting.
2. Physical room assignment history is derived from normal bookings and `booking_items.room_id`.
3. Booking History includes both current and historical records.
4. Stay state (upcoming/current/past) is a derived reporting concept and does not replace booking status.

## 12. Security Rules

1. Never expose private booking tokens, Stripe secrets, DB credentials, SMTP credentials, SSH credentials or `APP_KEY` in source/docs/log examples.
2. Guest document storage must remain non-public and accessed through authorized backend endpoints.
3. Admin APIs require authenticated admin access.
