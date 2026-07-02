# Mini CRM - Architecture Decisions

Version: 1.0

Status: Architecture Freeze

\---

# Purpose

This document explains WHY important technical and business decisions were made.

Future developers and AI assistants must follow these decisions unless explicitly changed by the Product Owner.

This document complements:

* BUSINESS\_RULES.md
* CODING\_STANDARDS.md
* UI\_GUIDELINES.md

\---

# Overall Architecture

Mini CRM follows a layered architecture.

Frontend

↓

React Components

↓

Service Layer

↓

REST API

↓

Backend Routes

↓

Controllers

↓

Services

↓

Prisma ORM

↓

PostgreSQL

Business logic belongs ONLY inside the Service layer.

\---

# Why React?

Reasons

* Fast Development
* Component Reusability
* Strong TypeScript Support
* Large Ecosystem
* Easy Future SaaS Scaling

Decision

Approved

\---

# Why Express?

Reasons

* Lightweight
* Easy API Development
* Flexible Middleware
* JWT Integration

Decision

Approved

\---

# Why Prisma?

Reasons

* Type Safety
* Easy Migrations
* Excellent Relation Handling
* Better Developer Experience

Decision

Approved

\---

# Why PostgreSQL?

Reasons

* Production Ready
* Strong Relational Database
* Excellent Performance
* Cloud Support

SQLite may be used only for local development.

Production database will always be PostgreSQL.

\---

# Why JWT?

Reasons

* Stateless Authentication
* Easy API Protection
* Mobile Friendly
* Industry Standard

Decision

Approved

\---

# Why Service Layer?

Controllers should remain thin.

Responsibilities

Controller

* Receive Request
* Validate
* Call Service
* Return Response

Service

* Business Logic
* Database Calls
* Validation
* Workflow

Decision

Never place business logic inside Controllers.

\---

# Why No Hard Delete?

Hard delete destroys:

* Reports
* Dashboard Statistics
* Audit History
* Business Relationships

Instead use

Archive

Inactive

Cancelled

Future implementation.

Decision

Never permanently delete:

* Leads
* Customers
* Follow-ups
* Tasks

\---

# Why Customer Cannot Be Created Directly?

CRM Business Flow

Lead

↓

Qualified

↓

Won

↓

Convert

↓

Customer

Benefits

* Complete Sales History
* Better Reports
* Lead Conversion Tracking

Decision

Customers are created ONLY through Lead Conversion.

\---

# Why Follow-ups and Tasks are Separate?

Follow-up

Customer Communication

Examples

* Phone Call
* WhatsApp
* Demo
* Meeting

Task

Internal Work

Examples

* Prepare Proposal
* Site Visit
* Documentation
* Quotation

Decision

Never merge these modules.

\---

# Why Dashboard Uses Live Data?

Dashboard is the business summary.

Static values create confusion.

Dashboard must always display live database values.

Decision

No hardcoded statistics.

\---

# Why React Query?

Benefits

* Automatic Cache
* Background Refetch
* Better UX
* Reduced API Calls

Decision

Use React Query for server state.

\---

# Why Zod + React Hook Form?

Frontend validation improves UX.

Backend validation protects data.

Decision

Both validations are mandatory.

\---

# Why UUID?

Reasons

* Better Security
* Safer Public APIs
* Easy Future Migrations

Decision

All primary keys use UUID.

\---

# Future Architecture

Mini CRM is the Core Engine.

Future Products

Mini CRM

↓

Solar CRM

↓

Real Estate CRM

↓

Manufacturing CRM

↓

Hospital CRM

↓

Education CRM

↓

AI CRM Platform

Every future product should reuse this architecture.

\---

# Architecture Principles

Keep modules independent.

Prefer composition over duplication.

Protect business history.

Use reusable components.

Maintain consistent UI.

Write readable code.

Optimize for scalability.

Never sacrifice architecture for speed.

\---

# Final Rule

When making any architectural decision ask:

"Will this decision still make sense after we have 100 clients using this CRM?"

If the answer is No,

Redesign before implementation.

