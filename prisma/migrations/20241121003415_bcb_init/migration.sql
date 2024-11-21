-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('PREPAID', 'POSTPAID');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "creditLimit" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "isWhatsApp" BOOLEAN NOT NULL,
    "text" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumption" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consumption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "Client"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Client_cnpj_key" ON "Client"("cnpj");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumption" ADD CONSTRAINT "Consumption_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
