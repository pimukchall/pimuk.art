-- AlterTable
ALTER TABLE `ITAsset` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `attachmentUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ITAssetLog` (
    `id` VARCHAR(191) NOT NULL,
    `itAssetId` VARCHAR(191) NOT NULL,
    `fromStatus` ENUM('IN_USE', 'IN_STORAGE', 'REPAIR', 'RETIRED', 'LOST') NULL,
    `toStatus` ENUM('IN_USE', 'IN_STORAGE', 'REPAIR', 'RETIRED', 'LOST') NOT NULL,
    `assignedTo` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ITAsset_serialNumber_key` ON `ITAsset`(`serialNumber`);

-- AddForeignKey
ALTER TABLE `ITAssetLog` ADD CONSTRAINT `ITAssetLog_itAssetId_fkey` FOREIGN KEY (`itAssetId`) REFERENCES `ITAsset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

