# Customer Management Module

## Purpose

Manage converted leads as customers.

\---

## User Stories

* Convert lead to customer
* View customer profile
* Update customer details
* View customer history

\---

## Customer Fields

* Company
* Contact Person
* Phone
* Email
* GST Number
* Address
* Industry
* Notes

\---

## Features

Customer List

Customer Profile

Edit Customer

Customer History

Search

Filter

Pagination

\---

## API

GET /api/customers

GET /api/customers/:id

POST /api/customers

PUT /api/customers/:id

DELETE /api/customers/:id

POST /api/leads/:id/convert

\---

## Database

Customer

* id
* leadId
* company
* contactPerson
* phone
* email
* gstNumber
* address
* industry
* notes
* createdAt
* updatedAt

\---

## Acceptance Criteria

* Lead converts successfully
* Customer profile created
* Customer searchable
* Customer editable

