-- AlterTable
ALTER TABLE `RecurringRule` ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `fromAssetId` VARCHAR(191) NULL,
    ADD COLUMN `note` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `toAssetId` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('INCOME', 'EXPENSE', 'TRANSFER') NOT NULL;

-- CreateTable
CREATE TABLE `Milestone` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `targetDate` DATETIME(3) NULL,
    `status` ENUM('PLANNED', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'PLANNED',
    `order` INTEGER NOT NULL DEFAULT 0,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `priority` ENUM('URGENT_IMPORTANT', 'URGENT_NOT_IMPORTANT', 'NOT_URGENT_IMPORTANT', 'NOT_URGENT_NOT_IMPORTANT') NOT NULL DEFAULT 'NOT_URGENT_NOT_IMPORTANT',
    `status` ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',
    `dueDate` DATETIME(3) NULL,
    `milestoneId` VARCHAR(191) NULL,
    `recurringRuleId` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalendarEvent` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NULL,
    `allDay` BOOLEAN NOT NULL DEFAULT false,
    `location` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RecurringRule` ADD CONSTRAINT `RecurringRule_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringRule` ADD CONSTRAINT `RecurringRule_fromAssetId_fkey` FOREIGN KEY (`fromAssetId`) REFERENCES `Asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurringRule` ADD CONSTRAINT `RecurringRule_toAssetId_fkey` FOREIGN KEY (`toAssetId`) REFERENCES `Asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_milestoneId_fkey` FOREIGN KEY (`milestoneId`) REFERENCES `Milestone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_recurringRuleId_fkey` FOREIGN KEY (`recurringRuleId`) REFERENCES `RecurringRule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

