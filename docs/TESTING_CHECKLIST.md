# Mini CRM - Testing Checklist

Version: 1.0

Status: Active

\---

# Purpose

This document defines the mandatory testing checklist before merging any feature into the main branch.

Every completed feature must pass all applicable tests.

No feature should be committed until this checklist is reviewed.

\---

# General Testing

* \[ ] Application starts successfully
* \[ ] Backend starts successfully
* \[ ] Database connected
* \[ ] No console errors
* \[ ] No network errors
* \[ ] No TypeScript errors
* \[ ] No ESLint errors
* \[ ] Build succeeds

\---

# Authentication

* \[ ] Login
* \[ ] Logout
* \[ ] Invalid Login
* \[ ] Session Persistence
* \[ ] Protected Routes
* \[ ] JWT Expiry

\---

# Dashboard

Verify

* \[ ] Total Leads
* \[ ] Active Customers
* \[ ] Today's Follow-ups
* \[ ] Pending Tasks
* \[ ] Tasks Due Today
* \[ ] Completed Today
* \[ ] Dashboard refreshes automatically

Dashboard must display LIVE data.

\---

# Lead Management

Create

* \[ ] Create Lead

Update

* \[ ] Edit Lead

View

* \[ ] View Lead

Search

* \[ ] Search

Filter

* \[ ] Status Filter

Pagination

* \[ ] Pagination

Business Rules

* \[ ] No Delete option
* \[ ] Lost Lead rules
* \[ ] Convert button visible only for Won Leads

\---

# Customer Management

* \[ ] Lead converts successfully
* \[ ] Customer created
* \[ ] Customer Profile
* \[ ] Search
* \[ ] Edit
* \[ ] No Delete option

Business Rules

* \[ ] Customer cannot be created directly
* \[ ] One Lead creates only one Customer
* \[ ] Converted badge displayed

\---

# Follow-up Management

Create

* \[ ] Create Follow-up

Edit

* \[ ] Edit Pending Follow-up

Complete

* \[ ] Complete Follow-up

Schedule

* \[ ] Schedule Next Follow-up

Dashboard

* \[ ] Today's Follow-ups

Business Rules

* \[ ] Follow-ups belong to Leads
* \[ ] No Delete option

\---

# Task Management

Create

* \[ ] Create Task

Edit

* \[ ] Edit Pending Task

Status

* \[ ] Pending → In Progress
* \[ ] Pending → Cancelled
* \[ ] In Progress → Completed

Validation

* \[ ] Completed cannot change
* \[ ] Cancelled cannot change

Dashboard

* \[ ] Pending Tasks
* \[ ] Due Today
* \[ ] Completed Today

Business Rules

* \[ ] No Delete option
* \[ ] Lost Leads cannot receive Tasks

\---

# Reports

(To be completed after Reports module.)

\---

# UI Testing

Verify

* \[ ] Responsive Design
* \[ ] Mobile
* \[ ] Tablet
* \[ ] Desktop

Check

* \[ ] Button Alignment
* \[ ] Card Spacing
* \[ ] Form Validation
* \[ ] Status Badges
* \[ ] Priority Badges

\---

# Performance

* \[ ] No unnecessary API calls
* \[ ] React Query cache works
* \[ ] Dashboard loads correctly
* \[ ] Pagination performs correctly

\---

# Security

* \[ ] JWT Protected APIs
* \[ ] Environment Variables
* \[ ] Password Hashing
* \[ ] Unauthorized requests blocked

\---

# Git Checklist

Before Push

* \[ ] Git Status Clean
* \[ ] Meaningful Commit Message
* \[ ] Push Successful

\---

# Screenshots

Capture screenshots for:

* Dashboard
* Leads
* Customers
* Follow-ups
* Tasks
* Reports (Future)

Store inside:

assets/screenshots/

\---

# Release Approval

Developer

☐ Approved

Software Architect

☐ Approved

Product Owner

☐ Approved

\---

# Final Rule

No feature is considered complete until:

✓ Code Complete

✓ Testing Complete

✓ Documentation Updated

✓ Git Commit Done

✓ Git Push Done

✓ Architect Review Completed

