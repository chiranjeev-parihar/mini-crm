# Coding Standards

Version: 1.0

\---

# Architecture

Frontend

React

↓

Services

↓

API

Backend

Routes

↓

Controllers

↓

Services

↓

Prisma

Database

\---

# Rules

Never place business logic inside controllers.

Controllers

Only

* Validation
* Request
* Response

Business logic belongs inside Services.

\---

# Folder Structure

Frontend

pages/

components/

services/

types/

hooks/

Backend

routes/

controllers/

services/

middleware/

types/

\---

# Naming

Components

PascalCase

TaskListPage.tsx

Services

camelCase

task.service.ts

Controllers

task.controller.ts

Routes

task.routes.ts

\---

# API

REST only.

Use proper HTTP status codes.

200

201

400

401

403

404

409

500

\---

# Validation

React Hook Form

* 

Zod

Backend validation mandatory.

Never trust frontend validation.

\---

# Authentication

JWT

Protected Routes

Environment Variables

Never hardcode secrets.

\---

# Database

Prisma

UUID IDs

createdAt

updatedAt

Use Relations.

Avoid duplicated data.

\---

# Error Handling

Never display

"An error occurred."

Display meaningful messages.

\---

# Performance

Use React Query.

Invalidate cache after mutations.

Avoid unnecessary API calls.

\---

# Git Convention

feat:

fix:

docs:

style:

refactor:

test:

chore:

\---

# Testing

Every module must pass

* CRUD
* Validation
* Dashboard
* Authentication
* Responsive UI

before Git Push.

