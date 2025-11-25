/*
  Warnings:

  - You are about to drop the column `note` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `suppliers` table. All the data in the column will be lost.
  - You are about to alter the column `vatNumber` on the `suppliers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - A unique constraint covering the columns `[orderNumber]` on the table `purchase_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `purchase_orders` DROP COLUMN `note`,
    ADD COLUMN `actualDeliveryDate` DATETIME(3) NULL,
    ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `deliveryAddress` TEXT NULL,
    ADD COLUMN `discountAmount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    ADD COLUMN `expectedDeliveryDate` DATETIME(3) NULL,
    ADD COLUMN `invoiceNumber` VARCHAR(100) NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `orderNumber` VARCHAR(50) NULL,
    ADD COLUMN `paymentMethod` VARCHAR(50) NULL,
    ADD COLUMN `paymentTerms` VARCHAR(100) NULL,
    ADD COLUMN `shippingCost` DECIMAL(10, 2) NULL DEFAULT 0.00,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NULL DEFAULT 0.00,
    ADD COLUMN `taxAmount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    MODIFY `total` DECIMAL(10, 2) NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `suppliers` DROP COLUMN `contact`,
    DROP COLUMN `note`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `city` VARCHAR(100) NULL,
    ADD COLUMN `companyName` VARCHAR(200) NULL,
    ADD COLUMN `contactPerson` VARCHAR(100) NULL,
    ADD COLUMN `country` VARCHAR(50) NULL DEFAULT 'Italia',
    ADD COLUMN `deliveryDays` VARCHAR(50) NULL,
    ADD COLUMN `discountPercentage` DECIMAL(5, 2) NULL DEFAULT 0.00,
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `minOrderAmount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    ADD COLUMN `mobile` VARCHAR(20) NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `paymentTerms` VARCHAR(100) NULL,
    ADD COLUMN `phone` VARCHAR(20) NULL,
    ADD COLUMN `postalCode` VARCHAR(10) NULL,
    ADD COLUMN `taxCode` VARCHAR(20) NULL,
    ADD COLUMN `website` VARCHAR(200) NULL,
    MODIFY `name` VARCHAR(200) NOT NULL,
    MODIFY `vatNumber` VARCHAR(20) NULL,
    MODIFY `address` TEXT NULL;

-- CreateTable
CREATE TABLE `purchase_order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseOrderId` INTEGER NOT NULL,
    `ingredientId` INTEGER NOT NULL,
    `quantity` DECIMAL(12, 3) NOT NULL,
    `unit` VARCHAR(20) NOT NULL,
    `unitPrice` DECIMAL(10, 4) NOT NULL,
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `receivedQuantity` DECIMAL(12, 3) NULL DEFAULT 0.000,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `purchase_orders_orderNumber_key` ON `purchase_orders`(`orderNumber`);

-- AddForeignKey
ALTER TABLE `purchase_order_items` ADD CONSTRAINT `purchase_order_items_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchase_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order_items` ADD CONSTRAINT `purchase_order_items_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
