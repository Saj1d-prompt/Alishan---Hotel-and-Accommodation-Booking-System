# 07 — System Modules

## 1. Public Website

### Routes

- `/`
- `/locations`
- `/locations/:slug`
- `/rooms` → redirects to locations
- `/rooms/:slug`
- `/booking`
- `/booking/status/:reference`
- `/about`
- `/contact`

### Responsibilities

Public content, location discovery, room-type presentation, booking application, secure booking status and payment initiation.

## 2. Property Catalogue Module

**Backend:** `PropertyController`, `PropertyCatalogService`, property resources and room availability logic.

Responsibilities:

- Return active locations.
- Return one location by slug.
- Resolve stay-term offers.
- Return live pricing and availability.

## 3. Availability Module

**Backend:** `RoomAvailabilityService`.

Responsibilities:

- Resolve stay dates/duration units.
- Enforce contract/date rules.
- Count eligible physical rooms.
- Exclude blocking overlapping assignments.
- Prevent creation of applications with zero valid inventory.

## 4. Booking Application Module

**Backend:** public Booking controller, `StoreBookingRequest`, `BookingRequestService`.

Responsibilities:

- Validate public application.
- Resolve property/room type/contract/price.
- Create/update guest.
- Create booking + booking item.
- Store guest document metadata/file.
- Generate booking reference + private token.
- Send submission notification.

## 5. Secure Booking Access Module

**Backend:** `PublicBookingAccessService`, `BookingAccessService`, public status endpoint.

Responsibilities:

- Resolve booking reference + token.
- Compare token hash safely.
- Generate secure status URLs for notifications.

## 6. Admin Authentication Module

**Backend:** `AdminAuthController`, Sanctum, `EnsureUserIsAdmin`.

**Frontend:** `AuthProvider`, `ProtectedRoute`, `/admin/login`.

Responsibilities:

- Login/logout/current-user identity.
- Enforce admin role.
- Protect dashboard routes/API.

## 7. Admin Booking Review Module

**Backend:** admin `BookingController`, `BookingReviewService`, approval/rejection request classes/resources.

**Frontend:** `Bookings.jsx`, `BookingDetails.jsx`, `BookingApprovalPanel.jsx`.

Responsibilities:

- List/search/filter/paginate applications.
- Load detailed booking data.
- Compute eligible rooms.
- Validate assignment.
- Approve/reject.
- Create payment plan transactionally.

## 8. Guest Document Module

**Backend:** `GuestDocumentController`, protected Storage.

Responsibilities:

- Authorized document download.
- Verification.
- Rejection with reason.
- Prevent inappropriate review outside pending-review workflow.

## 9. Payment Plan Module

**Backend:** `BookingPaymentPlanService`, `PaymentInstallment`.

Responsibilities:

- Full plan: one installment.
- Partial plan: two installments.
- Due-date conversion.
- Track paid and remaining balances.

## 10. Stripe Checkout Module

**Backend:** `PaymentCheckoutController`, `StripeCheckoutService`.

Responsibilities:

- Validate booking/token/payment eligibility.
- Select payable pending installment.
- Create local Payment.
- Create Stripe Checkout session with idempotency key.
- Return Checkout URL/reference data.

## 11. Stripe Webhook Module

**Backend:** `StripeWebhookController`, `StripeWebhookService`, `PaymentGatewayEvent`.

Responsibilities:

- Verify Stripe signature.
- Record/deduplicate gateway events.
- Apply successful payment to installment.
- Update local payment status.
- Confirm booking under current first-required-payment rule.
- Detect duplicate successful payment application.
- Trigger payment receipt workflow.

## 12. Notification Module

**Backend:** booking/payment notification services and notification classes.

Events include:

- booking submitted;
- booking approved;
- booking rejected;
- payment received;
- remaining payment reminder.

## 13. Scheduler Module

`payments:send-reminders` scans eligible second installments due within 24 hours and sends one tracked reminder. Laravel schedules the command every minute with overlap prevention; the production server still needs the normal scheduler trigger.

## 14. Admin Physical Rooms / Room History

**Status:** required extension; not part of the stable baseline implementation.

It should use `rooms → booking_items → bookings` plus the backend financial summary. No duplicate history table.

## 15. Booking History

**Status:** required extension; not part of the stable baseline implementation.

It should be a reporting/archive API + React page with server-side search/filter/pagination and derived stay state.
