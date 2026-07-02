# Task Management Module

## Purpose

The Task Management module helps users manage internal work related to Leads and Customers.

Unlike Follow-ups, Tasks represent internal work that needs to be completed by a team member.

Example:

Lead

↓

Prepare Proposal

↓

Collect Documents

↓

Schedule Site Visit

↓

Create Quotation

These are Tasks.

\---

# Business Rules

A Task may belong to:

* Lead
* Customer
* Internal Task

Every Task must have:

* Title
* Due Date
* Assigned User

A Task can exist without a Lead.

A completed Task cannot return to Pending.

Tasks are NOT Follow-ups.

Follow-ups are customer communication.

Tasks are internal work.

\---

# User Stories

As a Sales Executive

I want to

* Create Tasks
* Assign Tasks
* Complete Tasks
* Track Pending Tasks
* View Due Tasks
* Search Tasks
* Filter Tasks

\---

# Task Fields

Title \*

Description

Related Lead (Optional)

Related Customer (Optional)

Assigned User \*

Due Date \*

Priority

Status

Remarks

Created Date

Updated Date

\---

# Priority

Low

Medium

High

Urgent

\---

# Status

Pending

In Progress

Completed

Cancelled

\---

# Dashboard

Dashboard should display

Pending Tasks

Tasks Due Today

Completed Today

Overdue Tasks

Recent Tasks

\---

# Task List

Display

Title

Related Lead

Assigned User

Due Date

Priority

Status

Actions

\---

# Search

Search by

Task Title

Lead

Customer

Assigned User

\---

# Filters

Status

Priority

Due Today

Overdue

Completed

\---

# APIs

GET /tasks

GET /tasks/:id

POST /tasks

PUT /tasks/:id

DELETE /tasks/:id

GET /tasks/today

GET /tasks/overdue

\---

# Validation

Title Required

Assigned User Required

Due Date Required

\---

# Acceptance Criteria

User can

✔ Create Task

✔ Edit Task

✔ Delete Task

✔ View Task

✔ Search Task

✔ Filter Task

✔ Complete Task

✔ Dashboard updates automatically

\---

# Future Scope

Recurring Tasks

Task Comments

Attachments

Checklist

Notifications

Calendar Sync

These features are NOT part of MVP.

