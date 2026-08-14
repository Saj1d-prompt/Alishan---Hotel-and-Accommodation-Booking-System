# API Design and Current Route Reference

**Base prefix:** `/api/v1`

The current repository defines the following primary endpoints. Request/response resources in code remain the source of truth.

## Public Catalogue

### `GET /locations`

Returns active properties/locations.

### `GET /locations/{property}`

`{property}` resolves by property slug. Returns one active property.

### `GET /locations/{property}/room-types`

Returns room-type offers for a property based on validated query parameters such as stay term, occupants and applicable dates.

## Public Booking

### `POST /bookings`

Throttle: 10/minute.

Current request fields include:

- `property_slug`
- `room_type_slug`
- `term` (`short_term` or `long_term`)
- `occupants` (1–4)
- short-term `check_in_date`, `check_out_date`
- `first_name`, `last_name`
- `email`, `phone`
- `passport_number`
- `passport_copy` (`pdf/jpg/jpeg/png`, max 10 MB)
- optional `notes`
- `privacy_accepted`

Returns the created public booking representation and the one-time/private access token needed for later status access.

### `GET /bookings/{bookingReference}/status?token=...`

Throttle: 30/minute.

Requires the private token. Missing/invalid token deliberately behaves as not found.

## Public Stripe Checkout

### `POST /bookings/{bookingReference}/payments/checkout`

Throttle: 10/minute.

Requires the private booking token in the validated request. Returns Stripe Checkout/session/payment/installment details for the current payable installment.

## Stripe Webhook

### `POST /stripe/webhook`

No admin/customer session auth. Authentication is the Stripe signature checked against the configured webhook secret.

## Admin Authentication

### `POST /admin/login`

Throttle: 5/minute. Valid account must have admin role.

### `GET /admin/me`

Protected by Sanctum + admin middleware.

### `POST /admin/logout`

Protected; revokes current token.

## Admin Bookings

### `GET /admin/bookings`

Protected.

Current query parameters:

- `status` — BookingStatus enum
- `search` — booking reference, guest first/last name, email or phone
- `per_page` — 5–100, default 20

### `GET /admin/bookings/{booking:uuid}`

Returns detailed booking review data and currently eligible physical-room choices when appropriate.

### `POST /admin/bookings/{booking:uuid}/approve`

Current approval payload includes:

- `room_uuid`
- `payment_plan`: `full` or `partial`
- `amount_due_now` for partial plan
- `payment_due_at` (`Y-m-d`)
- `remaining_due_at` for partial plan (`Y-m-d`, after first due date)

### `POST /admin/bookings/{booking:uuid}/reject`

Requires rejection data as validated by the current request class.

## Guest Documents

Protected admin endpoints:

- `GET /admin/guest-documents/{guestDocument:uuid}/download`
- `POST /admin/guest-documents/{guestDocument:uuid}/verify`
- `POST /admin/guest-documents/{guestDocument:uuid}/reject`

## Guest Resource

The stable backend also exposes protected `Route::apiResource('guests', GuestController::class)` under `/admin`.

## API Conventions

- Public property routes use slugs.
- Admin booking routes use booking UUID route binding.
- Guest document routes use UUID binding.
- Internal database IDs should not be used as public URL contracts without a deliberate architecture change.
- Laravel owns validation and domain calculations.
- New reporting endpoints should be paginated and server-filtered.

## Planned Reporting APIs

Exact route names must be finalized during implementation, but architecture should provide:

- physical room operational listing;
- room booking history;
- booking history/reporting listing.

Do not create frontend routes/pages that depend on an endpoint until the backend route/contract is implemented and locally verified.
