-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('REMOTE', 'IN_PERSON');

-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "type" "SessionType" NOT NULL DEFAULT 'REMOTE';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "type" "SessionType" NOT NULL DEFAULT 'REMOTE';

-- AlterTable
ALTER TABLE "ProfessionalProfile" ADD COLUMN     "address" TEXT;

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_email_key" ON "Waitlist"("email");
