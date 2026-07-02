# Mini CRM - Business Rules

Version: 1.0
Status: Architecture Freeze

\---

# Purpose

This document defines the permanent business rules of Mini CRM.

These rules must never be violated unless the product owner explicitly changes them.

Every new module must follow these rules.

\---

# Completed Modules

## Authentication

Status: Completed

Features

* JWT Authentication
* Login
* Logout
* Protected Routes
* Password Hashing
* Session Persistence

\---

## Dashboard

Status: Completed

Features

* Total Leads
* Active Customers
* Today's Follow-ups
* Pending Tasks
* Tasks Due Today
* Completed Today
* Missed Follow-ups
* Today's Schedule

Dashboard always displays LIVE database values.

Static numbers are NOT allowed.

\---

## Lead Management

Status: Completed

Features

* Create
* Edit
* View
* Search
* Filter
* Pagination

Lead Status

* New
* Contacted
* Qualified
* Proposal Sent
* Negotiation
* Won
* Lost

Business Rules

Leads are NEVER permanently deleted.

Future implementation:

Archive Lead

\---

## Customer Management

Status: Completed

Customers are created ONLY from Leads.

Customer Creation Flow

Lead

↓

Won

↓

Convert

↓

Customer

Rules

Customer cannot be created directly.

One Lead creates only one Customer.

Already converted Leads cannot convert again.

Converted Leads display a Converted badge.

\---

## Follow-up Management

Status: Completed

Purpose

Track customer communication.

Follow-up Types

* Phone
* WhatsApp
* Email
* Meeting
* Demo
* Site Visit
* Other

Status

* Pending
* Completed
* Missed
* Cancelled

Business Rules

Follow-ups belong to Leads.

Follow-ups are customer communication.

They are NOT internal work.

\---

## Task Management

Status: Completed

Purpose

Internal work tracking.

Task Lifecycle

Pending

↓

In Progress

↓

Completed

OR

Pending

↓

Cancelled

Completed and Cancelled are FINAL states.

No further edits allowed.

Tasks may belong to:

* Lead
* Customer
* Internal

Business Rules

Tasks cannot be created for Lost Leads.

Tasks are NOT Follow-ups.

Delete is NOT allowed.

Use Cancel instead.

\---

# Global Business Rules

## Delete Policy

Never permanently delete:

* Leads
* Customers
* Follow-ups
* Tasks

Future implementation:

Archive

\---

## Dashboard

Dashboard must always display real database values.

No fake counters.

\---

## Status Badges

Every module must use consistent status badges.

\---

## Priority Colors

Low

Green

Medium

Blue

High

Orange

Urgent

Red

\---

## Business Flow

Lead

↓

Follow-up

↓

Won

↓

Convert

↓

Customer

↓

Task

↓

Reports

\---

## Future Modules

Reports

Dashboard Analytics

Settings

Deployment

AI Assistant

WhatsApp

Notifications

Role Management

