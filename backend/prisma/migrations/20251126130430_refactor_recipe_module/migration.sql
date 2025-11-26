/*
  Warnings:

  - You are about to alter the column `unit` on the `recipe_ingredients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to drop the column `note` on the `recipes` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `recipe_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `recipe_ingredients` ADD COLUMN `costPerUnit` DECIMAL(10, 4) NULL DEFAULT 0.0000,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isOptional` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `preparationStep` INTEGER NULL DEFAULT 1,
    ADD COLUMN `totalCost` DECIMAL(10, 4) NULL DEFAULT 0.0000,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `quantity` DECIMAL(12, 3) NOT NULL,
    MODIFY `unit` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `recipes` DROP COLUMN `note`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `chefNotes` TEXT NULL,
    ADD COLUMN `cookingTime` INTEGER NULL DEFAULT 0,
    ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
    ADD COLUMN `instructions` TEXT NULL,
    ADD COLUMN `portionSize` DECIMAL(8, 2) NULL DEFAULT 1.00,
    ADD COLUMN `preparationTime` INTEGER NULL DEFAULT 0,
    ADD COLUMN `totalCost` DECIMAL(10, 4) NULL DEFAULT 0.0000,
    ADD COLUMN `version` INTEGER NULL DEFAULT 1,
    MODIFY `name` VARCHAR(200) NOT NULL,
    MODIFY `description` TEXT NULL;
