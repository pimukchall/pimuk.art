-- CreateTable
CREATE TABLE `ITAsset` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('LAPTOP', 'DESKTOP', 'MONITOR', 'PERIPHERAL', 'NETWORK_EQUIPMENT', 'SOFTWARE_LICENSE', 'OTHER') NOT NULL,
    `status` ENUM('IN_USE', 'IN_STORAGE', 'REPAIR', 'RETIRED', 'LOST') NOT NULL DEFAULT 'IN_USE',
    `serialNumber` VARCHAR(191) NULL,
    `assignedTo` VARCHAR(191) NULL,
    `vendor` VARCHAR(191) NULL,
    `purchaseDate` DATETIME(3) NULL,
    `purchasePrice` DOUBLE NULL,
    `warrantyExpiry` DATETIME(3) NULL,
    `note` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
