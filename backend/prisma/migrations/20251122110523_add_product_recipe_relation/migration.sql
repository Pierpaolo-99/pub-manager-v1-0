-- AlterTable
ALTER TABLE `products` ADD COLUMN `recipeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `recipes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `recipes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_ingredients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeId` INTEGER NOT NULL,
    `ingredientId` INTEGER NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `recipe_ingredients_recipeId_ingredientId_key`(`recipeId`, `ingredientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
