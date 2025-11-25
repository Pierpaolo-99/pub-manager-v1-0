/*
  Warnings:

  - You are about to alter the column `unit` on the `ingredients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to drop the column `note` on the `movements` table. All the data in the column will be lost.
  - The values [IN,OUT] on the enum `movements_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `unit` to the `movements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ingredients` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `allergenInfo` JSON NULL,
    ADD COLUMN `barcode` VARCHAR(50) NULL,
    ADD COLUMN `category` ENUM('beverage', 'meat', 'fish', 'vegetable', 'dairy', 'grain', 'spice', 'sauce', 'other') NOT NULL DEFAULT 'other',
    ADD COLUMN `costPerUnit` DECIMAL(10, 4) NULL DEFAULT 0.0000,
    ADD COLUMN `density` DECIMAL(8, 3) NULL DEFAULT 1.000,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `nutritionalInfo` JSON NULL,
    ADD COLUMN `shelfLifeDays` INTEGER NULL DEFAULT 30,
    ADD COLUMN `storageType` ENUM('ambient', 'refrigerated', 'frozen') NOT NULL DEFAULT 'ambient',
    ADD COLUMN `supplier` VARCHAR(200) NULL,
    ADD COLUMN `supplierCode` VARCHAR(100) NULL,
    MODIFY `name` VARCHAR(200) NOT NULL,
    MODIFY `unit` VARCHAR(20) NOT NULL DEFAULT 'g',
    MODIFY `quantity` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `movements` DROP COLUMN `note`,
    ADD COLUMN `batchCode` VARCHAR(100) NULL,
    ADD COLUMN `batchId` INTEGER NULL,
    ADD COLUMN `costPerUnit` DECIMAL(10, 4) NULL,
    ADD COLUMN `expiryDate` DATETIME(3) NULL,
    ADD COLUMN `invoiceNumber` VARCHAR(100) NULL,
    ADD COLUMN `locationFrom` VARCHAR(100) NULL,
    ADD COLUMN `locationTo` VARCHAR(100) NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `reason` VARCHAR(200) NULL,
    ADD COLUMN `referenceId` INTEGER NULL,
    ADD COLUMN `referenceType` ENUM('order', 'purchase', 'production', 'manual', 'waste') NOT NULL DEFAULT 'manual',
    ADD COLUMN `supplier` VARCHAR(200) NULL,
    ADD COLUMN `totalCost` DECIMAL(10, 2) NULL,
    ADD COLUMN `unit` VARCHAR(20) NOT NULL,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `type` ENUM('purchase', 'sale', 'waste', 'adjustment', 'transfer', 'production') NOT NULL,
    MODIFY `quantity` DECIMAL(12, 3) NOT NULL;

-- AddForeignKey
ALTER TABLE `movements` ADD CONSTRAINT `movements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
