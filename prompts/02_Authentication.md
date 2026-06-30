Mini CRM - Step 5 Authentication
Read the following project documentation before generating any code:
docs/PRD.md
docs/Requirements.md
docs/Database.md
docs/API.md
docs/UserFlow.md
prompts/MASTER\_PROMPT.md
prompts/AI\_RULES.md
Task
Implement ONLY the Authentication module.
Do not modify any existing working dashboard layout except where authentication integration is required.
---

Backend Requirements
Implement:
User model using Prisma (if not already completed)
Password hashing using bcrypt
JWT Authentication
Login API
Authentication middleware
Protected API routes
Environment variables for JWT secret
Seed one default Admin user
Default Admin:
Email:
admin@minicrm.com
Password:
Admin@123
---

Frontend Requirements
Implement:
Login page
Form validation using React Hook Form + Zod
Login API integration
Store JWT securely
Authentication Context
Protected Routes
Redirect unauthenticated users to Login
Redirect authenticated users to Dashboard
Logout functionality
Display proper error messages for invalid login
---

Security Requirements
Never store plain text passwords.
Hash passwords using bcrypt.
Validate JWT on every protected request.
Do not expose sensitive information.
Use environment variables for secrets.
---

Acceptance Criteria
Authentication should satisfy all of the following:
Login works using:
Email:
admin@minicrm.com
Password:
Admin@123
Incorrect credentials show an error.
Dashboard cannot be accessed without login.
Successful login redirects to Dashboard.
Logout redirects to Login.
Refreshing the browser keeps the user logged in until the token expires.
Backend APIs validate JWT correctly.
---

Important
Do NOT build:
Leads
Customers
Follow-ups
Tasks
Reports
Notes
Settings
Authentication only.
---

At the end:
List all created files.
List all modified files.
Explain how to run database migration (if needed).
Explain how to seed the admin user.
Explain how to test authentication.
Wait for the next feature before generating anything else.

