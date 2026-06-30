# Mini CRM - Step 6 Lead Management

Read the following documentation before generating code:

* docs/PRD.md
* docs/Requirements.md
* docs/Database.md
* docs/API.md
* docs/UserFlow.md
* docs/Features/LeadManagement.md
* prompts/MASTER\_PROMPT.md
* prompts/AI\_RULES.md

\---

## Task

Implement ONLY the Lead Management module.

Do not modify the Authentication module except where integration is required.

\---

## Backend

Implement:

* Prisma Lead model
* Lead CRUD APIs
* Input validation
* Authentication middleware on all lead routes
* Pagination
* Search
* Status update
* Assign lead to user

\---

## Frontend

Implement:

* Lead List page
* Add Lead page
* Edit Lead page
* View Lead page
* Delete confirmation dialog
* Search bar
* Status filter
* Pagination
* Responsive table
* Loading state
* Empty state

\---

## Lead Fields

* Full Name
* Company
* Phone
* Email
* Source
* Status
* Assigned To
* Address
* Notes

\---

## Status Values

* New
* Contacted
* Qualified
* Proposal Sent
* Negotiation
* Won
* Lost

\---

## Acceptance Criteria

* User can create a lead.
* User can edit a lead.
* User can delete a lead.
* User can search leads.
* User can filter by status.
* User can paginate through results.
* Only authenticated users can access lead pages.

\---

Do NOT build:

* Customers
* Follow-ups
* Tasks
* Reports
* Settings
* AI Features

Lead Management only.

\---

At the end:

1. List created files.
2. List modified files.
3. Explain migration command.
4. Explain testing steps.
5. Wait for the next feature before generating anything else.

