# Mini CRM - Sprint 2 Task Management

Read the following project documentation before generating code:

* docs/PRD.md
* docs/Requirements.md
* docs/Database.md
* docs/API.md
* docs/UserFlow.md
* docs/ROADMAP.md
* docs/Features/TaskManagement.md
* prompts/MASTER\_PROMPT.md
* prompts/AI\_RULES.md

\---

# Objective

Implement ONLY the Task Management module.

Do NOT modify completed modules except where dashboard integration is required.

\---

# Backend

Implement

Prisma Task Model

CRUD APIs

Authentication

Validation

Dashboard Statistics

Search

Filters

Pagination

\---

# Task Model

Fields

id

title

description

assignedUserId

leadId (optional)

customerId (optional)

dueDate

priority

status

remarks

createdAt

updatedAt

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

# Frontend

Create

Task List

Task Details

Create Task

Edit Task

Delete Task

Search

Filters

Responsive Table

Priority Badge

Status Badge

Confirmation before Delete

\---

# Dashboard

Dashboard Cards

Pending Tasks

Due Today

Completed Today

Overdue Tasks

Recent Tasks

Statistics must use live database data.

\---

# Lead Integration

Inside Lead Details

Tasks Section

Create Task

Task History

\---

# Customer Integration

Only show related Tasks.

Do not create Tasks directly from Customer.

\---

# Validation

Title Required

Assigned User Required

Due Date Required

\---

# Acceptance Criteria

Create Task

Edit Task

Delete Task

Search

Filter

Dashboard Updates

Lead Integration

Authentication

Responsive UI

\---

Do NOT build

Reports

Analytics

Notifications

Calendar

Settings

AI

Only Task Management.

\---

At the end provide

1. Files Created
2. Files Modified
3. Migration Commands
4. Testing Steps
5. Wait for implementation plan approval.

