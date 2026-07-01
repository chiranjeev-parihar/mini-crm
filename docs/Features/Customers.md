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



\# Lead Conversion Rules



\## Business Logic



A customer cannot be created directly.



Customers are created only by converting a Lead.



\## Conversion Conditions



Lead Status must be:



\- Won



If Lead Status is anything else:



Display:



"This lead must be marked as Won before conversion."



\## Conversion Process



Lead



↓



Won



↓



Convert to Customer



↓



Customer Record Created



↓



Lead marked as Converted



\## Database Changes



Lead



\- isConverted (Boolean)

\- convertedAt (DateTime)



Customer



\- leadId (Relation)



\## Acceptance Criteria



\- Convert button visible only for Won leads.

\- Customer record created successfully.

\- Lead cannot be converted twice.

\- Converted lead displays "Converted" badge.

