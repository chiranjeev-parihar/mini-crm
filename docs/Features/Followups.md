# Follow-up Management Module

## Purpose

Track all customer interactions and ensure that no lead is forgotten.

\---

# Business Rules

Every Follow-up belongs to exactly one Lead.

A Lead can have multiple Follow-ups.

Completed Follow-ups cannot be edited.

A Follow-up can create another Follow-up.

\---

# User Stories

As a Sales Executive

* I want to schedule a follow-up.
* I want reminders for today's follow-ups.
* I want to mark a follow-up as completed.
* I want to add notes after every interaction.
* I want to schedule the next follow-up immediately.

\---

# Follow-up Fields

* Lead
* Follow-up Date
* Follow-up Time
* Type
* Status
* Notes
* Outcome
* Next Follow-up Date
* Created By

\---

# Follow-up Types

* Phone Call
* WhatsApp
* Email
* Meeting
* Site Visit
* Demo
* Other

\---

# Status

* Pending
* Completed
* Missed
* Cancelled

\---

# Dashboard Widgets

Today's Follow-ups

Upcoming Follow-ups

Missed Follow-ups

Completed Today

\---

# API

GET /followups

GET /followups/:id

POST /followups

PUT /followups/:id

DELETE /followups/:id

GET /followups/today

GET /followups/upcoming

\---

# Acceptance Criteria

* User can create follow-up.
* User can edit pending follow-up.
* User can complete follow-up.
* User can schedule next follow-up.
* Today's follow-ups appear on dashboard.
* Missed follow-ups are highlighted.

