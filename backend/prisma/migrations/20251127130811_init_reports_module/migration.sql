/*
  Warnings:

  - The values [X,Z,SUMMARY,DETAILED,EXPORT] on the enum `reports_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `financial_reports` MODIFY `type` ENUM('FINANCIAL', 'SALES', 'INVENTORY', 'PERFORMANCE', 'CUSTOM') NOT NULL;

-- CreateTable
CREATE TABLE `reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('FINANCIAL', 'SALES', 'INVENTORY', 'PERFORMANCE', 'CUSTOM') NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `period` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `requestedById` INTEGER NULL,
    `status` ENUM('PENDING', 'GENERATED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `format` ENUM('PDF', 'CSV', 'EXCEL', 'JSON') NOT NULL DEFAULT 'PDF',
    `data` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
