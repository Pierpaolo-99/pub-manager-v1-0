/*
  Warnings:

  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.
  - The values [IN_PROGRESS,COMPLETED,CANCELLED] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `priceAtSale` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_items` DROP COLUMN `price`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `priceAtSale` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'PREPARING', 'READY', 'SERVED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `subtotal` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `changeGiven` DECIMAL(10, 2) NULL,
    ADD COLUMN `customerEmail` VARCHAR(100) NULL,
    ADD COLUMN `customerName` VARCHAR(200) NULL,
    ADD COLUMN `customerPhone` VARCHAR(20) NULL,
    ADD COLUMN `discountAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `discountType` VARCHAR(20) NULL,
    ADD COLUMN `estimatedReadyTime` TIMESTAMP(0) NULL,
    ADD COLUMN `heldAt` TIMESTAMP(0) NULL,
    ADD COLUMN `kitchenNotes` TEXT NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `paidAt` TIMESTAMP(0) NULL,
    ADD COLUMN `paymentMethod` ENUM('CASH', 'CARD', 'BANCOMAT', 'APP') NOT NULL DEFAULT 'CASH',
    ADD COLUMN `paymentStatus` ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `promotionId` INTEGER NULL,
    ADD COLUMN `servedAt` TIMESTAMP(0) NULL,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `taxAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `status` ENUM('PENDING', 'IN_PREPARAZIONE', 'PRONTO', 'SERVITO', 'PAGATO', 'ANNULLATO') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `promotions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `type` ENUM('PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `minAmount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `maxDiscount` DECIMAL(10, 2) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `startTime` TIME(0) NULL,
    `endTime` TIME(0) NULL,
    `daysOfWeek` JSON NULL,
    `maxUses` INTEGER NULL,
    `currentUses` INTEGER NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_promotionId_fkey` FOREIGN KEY (`promotionId`) REFERENCES `promotions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
