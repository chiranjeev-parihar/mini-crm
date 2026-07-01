# Mini CRM - Step 8 Follow-up Management

Read before generating:

* docs/PRD.md
* docs/Requirements.md
* docs/Database.md
* docs/API.md
* docs/UserFlow.md
* docs/Features/Followups.md
* prompts/MASTER\_PROMPT.md
* prompts/AI\_RULES.md

\---

## Task

Implement ONLY the Follow-up Management module.

Do not modify Authentication, Lead Management or Customer Management except where Follow-up integration is required.

\---

# Backend

Implement

## Prisma Model

FollowUp

Fields

* id
* leadId
* followUpDate
* followUpTime
* type
* status
* notes
* outcome
* nextFollowUpDate
* createdBy
* createdAt
* updatedAt

Create APIs

GET /followups

GET /followups/:id

POST /followups

PUT /followups/:id

DELETE /followups/:id

GET /followups/today

GET /followups/upcoming

Protect all routes using JWT.

\---

# Frontend

Create

* Follow-up List
* Follow-up Details
* Add Follow-up
* Edit Follow-up

Integrate with Lead Details.

Each Lead should have a Follow-up History section.

Allow creating a Follow-up directly from the Lead page.

\---

# Dashboard

Show

Today's Follow-ups

Upcoming Follow-ups

Missed Follow-ups

Completed Today

Dashboard statistics must use real database values.

\---

# Business Rules

Pending Follow-up

↓

Complete

↓

Add Outcome

↓

Schedule Next Follow-up

Completed follow-ups cannot be edited.

Missed follow-ups appear in red.

\---

# Acceptance Criteria

* Create Follow-up
* Edit Pending Follow-up
* Complete Follow-up
* Schedule Next Follow-up
* Dashboard widgets update automatically
* Follow-up history visible inside Lead Details

\---

Do NOT build

Tasks

Reports

Notifications

Calendar

AI

Only Follow-up Management.

\---

At the end provide

1. Created files
2. Modified files
3. Migration command
4. Testing steps
5. Wait for next feature.

