/*
  Warnings:

  - Added the required column `beneficiaryName` to the `BankAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardType` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BankAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "beneficiaryName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BankAccount" ("accountNumber", "bankName", "id", "userId") SELECT "accountNumber", "bankName", "id", "userId" FROM "BankAccount";
DROP TABLE "BankAccount";
ALTER TABLE "new_BankAccount" RENAME TO "BankAccount";
CREATE TABLE "new_Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "brand" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "expiryDate" DATETIME NOT NULL,
    "cvv" INTEGER NOT NULL,
    CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("cardNumber", "cvv", "expiryDate", "id", "userId") SELECT "cardNumber", "cvv", "expiryDate", "id", "userId" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
PRAGMA foreign_key_check("BankAccount");
PRAGMA foreign_key_check("Card");
PRAGMA foreign_keys=ON;
