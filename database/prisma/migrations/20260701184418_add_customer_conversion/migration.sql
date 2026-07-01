-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lead_id" TEXT NOT NULL,
    "company" TEXT,
    "contact_person" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "industry" TEXT,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "customers_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "assigned_to" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "is_converted" BOOLEAN NOT NULL DEFAULT false,
    "converted_at" DATETIME,
    "conversion_reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "leads_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_leads" ("address", "assigned_to", "company", "created_at", "email", "full_name", "id", "notes", "phone", "source", "status", "updated_at") SELECT "address", "assigned_to", "company", "created_at", "email", "full_name", "id", "notes", "phone", "source", "status", "updated_at" FROM "leads";
DROP TABLE "leads";
ALTER TABLE "new_leads" RENAME TO "leads";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "customers_lead_id_key" ON "customers"("lead_id");
