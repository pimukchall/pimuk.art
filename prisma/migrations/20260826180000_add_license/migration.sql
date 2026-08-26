-- CreateTable
CREATE TABLE `License` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `vendor` VARCHAR(191) NULL,
    `licenseKey` VARCHAR(191) NULL,
    `seatsTotal` INTEGER NOT NULL DEFAULT 1,
    `cost` DOUBLE NULL,
    `billingCycle` ENUM('ONE_TIME', 'MONTHLY', 'YEARLY') NOT NULL DEFAULT 'YEARLY',
    `purchaseDate` DATETIME(3) NULL,
    `renewalDate` DATETIME(3) NULL,
    `autoRenew` BOOLEAN NOT NULL DEFAULT false,
    `note` TEXT NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LicenseSeat` (
    `id` VARCHAR(191) NOT NULL,
    `licenseId` VARCHAR(191) NOT NULL,
    `assignedTo` VARCHAR(191) NOT NULL,
    `itAssetId` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LicenseSeat` ADD CONSTRAINT `LicenseSeat_licenseId_fkey` FOREIGN KEY (`licenseId`) REFERENCES `License`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LicenseSeat` ADD CONSTRAINT `LicenseSeat_itAssetId_fkey` FOREIGN KEY (`itAssetId`) REFERENCES `ITAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

