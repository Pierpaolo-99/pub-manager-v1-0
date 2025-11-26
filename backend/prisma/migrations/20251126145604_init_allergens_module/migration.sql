-- CreateTable
CREATE TABLE `allergens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `allergens_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredient_allergens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingredientId` INTEGER NOT NULL,
    `allergenId` INTEGER NOT NULL,

    UNIQUE INDEX `ingredient_allergens_ingredientId_allergenId_key`(`ingredientId`, `allergenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_allergens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `allergenId` INTEGER NOT NULL,

    UNIQUE INDEX `product_allergens_productId_allergenId_key`(`productId`, `allergenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ingredient_allergens` ADD CONSTRAINT `ingredient_allergens_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingredient_allergens` ADD CONSTRAINT `ingredient_allergens_allergenId_fkey` FOREIGN KEY (`allergenId`) REFERENCES `allergens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_allergens` ADD CONSTRAINT `product_allergens_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_allergens` ADD CONSTRAINT `product_allergens_allergenId_fkey` FOREIGN KEY (`allergenId`) REFERENCES `allergens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
