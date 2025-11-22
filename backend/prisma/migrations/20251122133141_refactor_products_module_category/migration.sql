/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - Made the column `categoryId` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_categoryId_fkey`;

-- DropIndex
DROP INDEX `products_categoryId_fkey` ON `products`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `price`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `basePrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `calories` INTEGER NULL,
    ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `imageUrl` VARCHAR(500) NULL,
    ADD COLUMN `preparationTime` INTEGER NULL DEFAULT 0,
    ADD COLUMN `sortOrder` INTEGER NULL DEFAULT 0,
    MODIFY `name` VARCHAR(200) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `categoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
