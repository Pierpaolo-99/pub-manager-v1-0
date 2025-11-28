-- CreateTable
CREATE TABLE `analytics_dashboards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `config` JSON NOT NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analytics_kpis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dashboardId` INTEGER NOT NULL,
    `type` ENUM('SALES', 'MARGIN', 'PROFIT', 'COST', 'INVENTORY', 'USER', 'PERFORMANCE', 'CUSTOM') NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `value` DECIMAL(16, 4) NOT NULL,
    `period` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `breakdown` JSON NULL,
    `notes` TEXT NULL,
    `filters` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analytics_breakdowns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dashboardId` INTEGER NOT NULL,
    `type` ENUM('CATEGORY', 'PRODUCT', 'SUPPLIER', 'USER', 'DAY', 'WEEK', 'MONTH', 'CUSTOM') NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `data` JSON NOT NULL,
    `groupBy` VARCHAR(191) NULL,
    `period` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `filters` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `analytics_dashboards` ADD CONSTRAINT `analytics_dashboards_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analytics_kpis` ADD CONSTRAINT `analytics_kpis_dashboardId_fkey` FOREIGN KEY (`dashboardId`) REFERENCES `analytics_dashboards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analytics_breakdowns` ADD CONSTRAINT `analytics_breakdowns_dashboardId_fkey` FOREIGN KEY (`dashboardId`) REFERENCES `analytics_dashboards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
