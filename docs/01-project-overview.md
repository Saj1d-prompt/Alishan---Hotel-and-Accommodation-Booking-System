# 01 — Project Overview

## Project Name

**Alishan Accommodation Management System**

## Purpose

Alishan manages the full lifecycle of accommodation applications for multiple Lithuanian properties: public discovery, room-type availability, application intake, document review, physical-room assignment, payment planning, Stripe payment confirmation and administrative operations.

## What the Product Is Not

- Not an Airbnb clone.
- Not a property sales system.
- Not a generic hotel demo.
- Not customer-account driven in v1.

## Users

### Public Guest

A public guest can:

- Browse active locations.
- View property and room-type information.
- Query live availability/pricing.
- Submit a booking application.
- Upload required identity/residence documentation.
- Receive a booking reference and private access token.
- Check booking/payment status using the private status link.
- Start Stripe Checkout when payment is available.

A public guest **does not register or log in** in v1.

### Administrator

An administrator can:

- Log in through `/admin/login`.
- View/search/filter bookings.
- Review booking details.
- Download, verify or reject guest documents.
- Assign a physical room.
- Approve or reject a pending booking.
- Choose full or partial payment plan.
- Work with future operational room/history/reporting modules.

## High-Level Architecture

```text
Browser
  │
  ├── Public React UI
  └── Admin React UI
          │
          ▼
     Axios / REST
          │
          ▼
Laravel 12 API
  ├── Request validation
  ├── Controllers
  ├── Services / business rules
  ├── Eloquent models
  ├── Sanctum admin auth
  ├── Laravel Storage
  ├── Notifications / scheduler
  └── Stripe integration
          │
          ├── MySQL
          └── Stripe
```

## Technology Stack

### Frontend

- React 19
- JavaScript
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios
- React Hook Form
- date-fns

### Backend

- Laravel 12
- REST API
- Laravel Sanctum
- Spatie Laravel Permission
- Laravel Storage
- Laravel Scheduler / database queue
- Stripe PHP SDK

### Infrastructure

- MySQL
- Hostinger
- Production frontend: `alishan.lt`
- Production API: `api.alishan.lt`
- Production PHP: 8.3

## Current Core Domain Entities

- Country
- City
- Property
- PropertyImage
- RoomType
- Room
- Bed
- Contract
- PropertyContract
- PriceList
- Guest
- GuestDocument
- Booking
- BookingItem
- PaymentInstallment
- Payment
- PaymentGatewayEvent
- User

## Current Booking States

- `pending_review`
- `awaiting_payment`
- `confirmed`
- `rejected`
- `payment_expired`
- `cancelled`
- `checked_in`
- `checked_out`

## Financial Summary States

Derived by the backend from booking total and installment state:

- `unpaid`
- `partially_paid`
- `paid`
- `overdue`

These are separate from booking status.

## Key Design Principle

The backend is authoritative for business rules, availability, pricing, payment state and security. React renders data and submits user actions; it must not duplicate core domain calculations.
