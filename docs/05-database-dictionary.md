# Database Dictionary

**Project:** Alishan Accommodation Booking System

**Version:** 1.0

**Database:** MySQL / MariaDB

---

# Purpose

This document defines every database table used in the system.

For each table it specifies:

* Purpose
* Columns
* Data Types
* Constraints
* Relationships
* Indexes
* Business Notes

This document is the primary reference for Laravel migrations, Eloquent models, API development, and future maintenance.

---

# Naming Standards

## Table Names

Plural

Example:

* users
* properties
* rooms
* bookings

---

## Model Names

Singular

Example:

* User
* Property
* Room
* Booking

---

## Primary Keys

All tables use:

`id`

Type:

`BIGINT UNSIGNED AUTO_INCREMENT`

---

## Foreign Keys

Foreign keys follow Laravel conventions.

Examples:

* user_id
* property_id
* room_id
* city_id
* country_id

---

## Timestamps

Every table includes:

* created_at
* updated_at

---

## Soft Deletes

Soft deletes are applied only to business entities that may need to be restored, such as:

* properties
* rooms
* beds
* bookings

Reference tables (e.g., countries and cities) generally use hard deletes unless business requirements change.

---

# Module 1 – Location

## Table: countries

### Purpose

Stores the list of countries where accommodation properties are located.

### Relationships

* One Country has many Cities.

### Columns

| Column     | Type            | Nullable | Default           | Index       | Description                            |
| ---------- | --------------- | -------- | ----------------- | ----------- | -------------------------------------- |
| id         | BIGINT UNSIGNED | No       | Auto Increment    | Primary Key | Unique identifier                      |
| name       | VARCHAR(100)    | No       | —                 | UNIQUE      | Country name                           |
| iso_code   | CHAR(2)         | No       | —                 | UNIQUE      | ISO 3166-1 Alpha-2 code (e.g., LT, DE) |
| status     | BOOLEAN         | No       | TRUE              | INDEX       | Active or inactive                     |
| created_at | TIMESTAMP       | No       | CURRENT_TIMESTAMP | —           | Record creation time                   |
| updated_at | TIMESTAMP       | No       | CURRENT_TIMESTAMP | —           | Last update time                       |

### Business Notes

* Country names must be unique.
* ISO codes must be unique.
* Countries should not be deleted if they are referenced by cities.

---

## Table: cities

### Purpose

Stores cities where accommodation properties exist.

### Relationships

* Belongs to one Country.
* Has many Properties.

### Columns

| Column     | Type            | Nullable | Default           | Index       | Description                  |
| ---------- | --------------- | -------- | ----------------- | ----------- | ---------------------------- |
| id         | BIGINT UNSIGNED | No       | Auto Increment    | Primary Key | Unique identifier            |
| country_id | BIGINT UNSIGNED | No       | —                 | Foreign Key | References countries.id      |
| name       | VARCHAR(100)    | No       | —                 | INDEX       | City name                    |
| slug       | VARCHAR(120)    | No       | —                 | UNIQUE      | SEO-friendly city identifier |
| status     | BOOLEAN         | No       | TRUE              | INDEX       | Active or inactive           |
| created_at | TIMESTAMP       | No       | CURRENT_TIMESTAMP | —           | Record creation time         |
| updated_at | TIMESTAMP       | No       | CURRENT_TIMESTAMP | —           | Last update time             |

### Business Notes

* A city belongs to exactly one country.
* City names should be unique within the same country.
* Slugs are used for SEO-friendly URLs.
* Cities should not be deleted if they are referenced by properties.

---

# Upcoming Modules

The following modules will be documented next:

* Property Management
* Room Management
* Pricing
* Booking
* Payments
* User Management
