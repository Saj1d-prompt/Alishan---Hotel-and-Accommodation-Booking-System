# Business Rules

## Property Rules

* A property belongs to one city.
* A city belongs to one country.
* A property can contain multiple rooms.
* A property can have multiple images.
* A property can have multiple amenities.

---

## Room Rules

* A room belongs to one property.
* A room belongs to one room type.
* A room may contain one or more beds.
* A room can have multiple pricing plans.
* A room can have multiple images.

---

## Bed Rules

* Every bed belongs to exactly one room.
* A bed cannot belong to multiple rooms.
* A bed can only be assigned to one active booking for overlapping dates.

---

## Contract Rules

* Contracts define accommodation duration.
* A property may support multiple contract types.
* Room pricing depends on the selected contract.

---

## Booking Rules

* A booking belongs to one customer.
* A booking belongs to one property.
* A booking belongs to one room.
* A booking uses one contract.
* A booking can reserve an entire room or one or more beds.
* Availability must be validated before confirming a booking.
* Double booking for the same room or bed during overlapping dates is not allowed.

---

## Payment Rules

* Every booking has a payment record.
* A booking is confirmed only after successful payment (unless an offline payment workflow is introduced).
* Payment status must be tracked independently from booking status.

---

## User Rules

### Guest

* Can browse the website.
* Cannot make bookings.

### Customer

* Can create bookings.
* Can manage their own profile.
* Can view their own booking history.

### Administrator

* Can manage all operational data.
* Can approve, update, or cancel bookings.
* Can manage pricing, rooms, properties, and contracts.

---

## Pricing Rules

* Pricing is stored separately from rooms.
* A room may have different prices for different contract durations.
* Future seasonal pricing must be supported without changing the core schema.

---

## Availability Rules

* Availability is calculated using booking dates.
* Rooms or beds under maintenance are not bookable.
* Inactive properties, rooms, or beds must not appear in customer searches.

---

## Audit Rules

* Important records should retain creation and update timestamps.
* Critical business entities should support soft deletes where appropriate.

---

## Design Principles

* Normalize data where practical.
* Avoid duplicate information.
* Use foreign keys to maintain integrity.
* Keep the system extensible for future business growth.

## Public Identifiers

Customers never see database IDs.

Public-facing entities use:

- Property Slug
- Booking Reference
- Payment Reference



Booking references must be unique.