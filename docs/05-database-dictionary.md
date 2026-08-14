# 05 — Database Dictionary

This dictionary reflects the stable repository migrations through **7 August 2026**. Always inspect new migrations before treating this file as current.

## Business Tables

### `countries`

| Column | Type / rule | Purpose |
|---|---|---|
| `id` | bigint PK | Internal key |
| `name` | varchar(100) | Country name |
| `iso_code` | char(2), unique | ISO country code |
| `status` | boolean, default true | Active flag |
| timestamps | | Audit timestamps |

### `cities`

| Column | Type / rule | Purpose |
|---|---|---|
| `id` | bigint PK | Internal key |
| `country_id` | FK → countries | Parent country |
| `name` | varchar(100) | City name |
| `slug` | varchar(120), unique | Public slug |
| `status` | boolean | Active flag |
| timestamps | | Audit timestamps |

Unique: `(country_id, name)`.

### `properties`

| Column | Type / rule | Purpose |
|---|---|---|
| `id` | bigint PK | Internal key |
| `uuid` | UUID, unique | External-safe identifier |
| `city_id` | FK → cities | Location |
| `name` | varchar(150) | Property name |
| `slug` | varchar(180), unique | Public route key |
| `address`, `postcode` | nullable strings | Address data |
| `latitude`, `longitude` | nullable decimals | Map coordinates |
| `short_description` | nullable text | Summary |
| `description` | nullable long text | Full description |
| `check_in_time`, `check_out_time` | nullable time | Property operating times |
| `display_order` | unsigned integer | Public ordering |
| `status` | boolean | Active flag |
| timestamps / soft delete | | Lifecycle |

### `property_images`

Stores property image metadata: `uuid`, `property_id`, `file_name`, storage `disk`, MIME type, file size, dimensions, alt text, caption, category, cover flag, sort order, status, timestamps and soft delete.

### `room_types`

Stores room-category definitions: `uuid`, `name`, unique `slug`, description, `default_capacity`, display order, active flag, timestamps and soft delete.

### `rooms`

| Column | Type / rule | Purpose |
|---|---|---|
| `id` | bigint PK | Internal room key |
| `uuid` | UUID, unique | External-safe identifier |
| `property_id` | FK | Property |
| `room_type_id` | nullable FK | Room type |
| `room_number` | varchar(50) | Physical number/name |
| `floor` | nullable tinyint | Physical floor |
| `capacity` | nullable tinyint | Max occupants |
| `size_sqm` | nullable decimal(6,2) | Room size |
| `gender` | enum | `male`, `female`, `mixed` |
| `booking_mode` | enum | `room`, `bed`, `both` |
| `description` | nullable text | Notes/description |
| `display_order` | unsigned integer | Ordering |
| `status` | boolean | Active flag |
| timestamps / soft delete | | Lifecycle |

Unique: `(property_id, room_number)`.

### `beds`

Stores physical beds: `uuid`, `room_id`, `bed_number`, description, display order, status, timestamps and soft delete. `(room_id, bed_number)` is unique.

### `contracts`

Defines stay products. Important fields: `uuid`, unique `code`, name, `billing_unit`, minimum nights, maximum months, optional fixed start/end month/day, description, display order, status, timestamps and soft delete.

### `property_contracts`

Joins properties to contracts. Fields: `property_id`, `contract_id`, JSON `allowed_floors`, status and timestamps. `(property_id, contract_id)` is unique.

### `price_lists`

| Column | Purpose |
|---|---|
| `uuid` | External-safe ID |
| `property_contract_id` | Property + contract combination |
| `room_type_id` | Room type being priced |
| `price` | Unit price |
| `currency` | Current default EUR |
| `charge_basis` | Current default `per_person` |
| `utilities_included` | Nullable business flag |
| `effective_from`, `effective_until` | Effective period |
| `status` | Active flag |
| timestamps / soft delete | Lifecycle |

Unique: `(property_contract_id, room_type_id, effective_from)`.

### `guests`

| Column | Purpose |
|---|---|
| `uuid`, `guest_code` | Safe/business identifiers |
| `first_name`, `last_name` | Name |
| `phone`, `email` | Contact |
| DOB/gender/nationality | Optional profile data |
| `document_type` | Identity document type |
| `document_number` | Encrypted value |
| `document_number_hash` | Unique SHA-256-like lookup hash |
| `document_expiry_date` | Optional expiry |
| address/emergency contact/notes | Optional profile data |
| `status` | Active flag |
| timestamps / soft delete | Lifecycle |

### `bookings`

| Column | Purpose |
|---|---|
| `uuid` | Admin-safe route identifier |
| `booking_reference` | Public business reference |
| `guest_id` | Applicant |
| `property_id` | Property |
| `created_by_user_id` | Optional internal creator |
| `reviewed_by_user_id` | Admin reviewer |
| `guest_count` | Occupants |
| `check_in_date`, `check_out_date` | Stay period |
| `estimated_total_amount` | System-calculated application total |
| `total_amount` | Approved payable total |
| `currency` | Currency |
| `booking_status` | Operational booking status |
| `source` | Origin; website by default |
| `public_access_token_hash` | Hash for private public access |
| `public_access_token` | Encrypted recoverable token used by notification/status-link logic |
| submitted/privacy/review/payment/confirmation/cancellation timestamps | Workflow timestamps |
| `rejection_reason` | Rejection explanation |
| `notes` | Optional notes |
| timestamps / soft delete | Lifecycle |

### `booking_items`

Represents the requested/accommodated unit and pricing snapshot.

| Column | Purpose |
|---|---|
| `booking_id` | Parent booking |
| `room_type_id` | Requested room type |
| `room_id` | Physical room assigned at approval; nullable before approval |
| `bed_id` | Optional bed assignment |
| `contract_id` | Selected stay contract |
| `price_list_id` | Price record used |
| `unit_price` | Price snapshot |
| `billing_unit` | Billing unit snapshot |
| `charge_basis` | Charge basis snapshot |
| `occupant_count` | Charged occupants |
| `duration_units` | Nights/months/etc. used by pricing |
| `subtotal` | Calculated subtotal |
| timestamps | Audit |

### `guest_documents`

Stores protected uploaded document metadata: `uuid`, `guest_id`, `booking_id`, document type, storage disk/path, original name, MIME type, file size, SHA-256 hash, verification status, verifier user ID, verification timestamp, rejection reason, timestamps and soft delete.

### `payment_installments`

| Column | Purpose |
|---|---|
| `uuid` | Safe identifier |
| `booking_id` | Parent booking |
| `installment_number` | 1 or 2 in current plan model |
| `label` | Full payment / Initial payment / Remaining balance |
| `amount` | Required amount |
| `paid_amount` | Amount applied |
| `due_at` | Due time |
| `status` | Current installment state |
| `paid_at` | Completion time |
| `reminder_notification_queued_at` | Reminder tracking |
| timestamps | Audit |

Unique: `(booking_id, installment_number)`.

### `payments`

| Column | Purpose |
|---|---|
| `uuid` | Safe identifier |
| `booking_id` | Parent booking |
| `payment_installment_id` | Related installment |
| `payment_reference` | Internal payment reference |
| `gateway` | Payment gateway |
| `gateway_session_id` | Stripe Checkout session ID |
| `gateway_payment_intent_id` | Stripe PaymentIntent ID |
| `transaction_id` | Recorded transaction reference |
| `amount`, `currency` | Money |
| `payment_status` | `pending`, `paid`, `failed`, `refunded` |
| failure code/message | Failure/exception detail |
| `paid_at` | Paid time |
| `refunded_amount`, `refunded_at` | Refund tracking |
| `receipt_notification_queued_at` | Receipt notification tracking |
| timestamps / soft delete | Lifecycle |

### `payment_gateway_events`

Stores webhook processing identity/status: gateway, event ID, event type, processing status, payload hash, processed time, error message and timestamps. `(gateway, event_id)` is unique.

## Authentication / Framework Tables

- `users`
- `password_reset_tokens`
- `sessions`
- `personal_access_tokens`
- Spatie permission/role pivot tables
- Laravel `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`

These are framework/infrastructure tables and should not be used as substitutes for business-domain records.
