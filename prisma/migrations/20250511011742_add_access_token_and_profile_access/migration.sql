/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessToken" TEXT;

-- CreateTable
CREATE TABLE "ProfileAccess" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "granterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "ProfileAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileAccess_granterId_idx" ON "ProfileAccess"("granterId");

-- CreateIndex
CREATE INDEX "ProfileAccess_receiverId_idx" ON "ProfileAccess"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileAccess_granterId_receiverId_key" ON "ProfileAccess"("granterId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "User_accessToken_key" ON "User"("accessToken");

-- AddForeignKey
ALTER TABLE "ProfileAccess" ADD CONSTRAINT "ProfileAccess_granterId_fkey" FOREIGN KEY ("granterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileAccess" ADD CONSTRAINT "ProfileAccess_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
