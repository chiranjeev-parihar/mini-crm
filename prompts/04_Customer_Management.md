# Mini CRM - Step 7 Customer Management

Read the following project documentation before generating any code:

* docs/PRD.md
* docs/Requirements.md
* docs/Database.md
* docs/API.md
* docs/UserFlow.md
* docs/Features/Customers.md
* prompts/MASTER\_PROMPT.md
* prompts/AI\_RULES.md

\---

# Task

Implement ONLY the Customer Management module.

Do NOT modify Authentication or Lead Management except where Customer conversion is required.

\---

# Business Rules

A Customer CANNOT be created directly.

Customers are created ONLY by converting a Lead.

A Lead can only be converted if:

Status = Won

If status is anything else:

Display:

"This lead must be marked as Won before conversion."

A converted lead:

* Cannot be converted again.
* Must display a "Converted" badge.
* Must store conversion date.
* Must create a linked Customer record.

\---

# Backend

Implement:

## Customer Model

Fields:

* id
* leadId
* company
* contactPerson
* phone
* email
* address
* industry
* notes
* createdAt
* updatedAt

\---

Update Lead Model

Add:

* isConverted
* convertedAt

\---

Create APIs

GET /customers

GET /customers/:id

PUT /customers/:id

DELETE /customers/:id

POST /leads/:id/convert

\---

Validation

* Prevent duplicate conversion.
* Return proper HTTP status codes.
* Protect all APIs using JWT middleware.

\---

# Frontend

Create:

Customer List

Customer Details

Customer Edit

Customer Search

Customer Profile

\---

Lead Module Changes

If Lead Status = Won

Show button:

Convert to Customer

After successful conversion:

Hide button.

Show badge:

Converted

\---

Customer List

Display:

* Company
* Contact Person
* Phone
* Email
* Industry

Include:

Search

Pagination

Responsive Table

Loading State

Empty State

\---

# Acceptance Criteria

A lead with status Won:

✓ Shows Convert button

✓ Converts successfully

✓ Creates Customer

✓ Marks Lead as Converted

✓ Cannot convert twice

Customer module displays converted customers only.

\---

Do NOT build:

Follow-ups

Tasks

Reports

Settings

AI Features

Only Customer Management.

\---

At the end provide:

1. Created files
2. Modified files
3. Migration command
4. Testing steps
5. Wait for the next feature before generating anything else.

