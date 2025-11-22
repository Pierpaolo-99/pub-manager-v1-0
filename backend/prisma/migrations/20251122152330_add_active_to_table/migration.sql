-- AlterTable
ALTER TABLE `tables` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `location` VARCHAR(100) NULL;
