-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(191) NULL DEFAULT 'user',
    MODIFY `is_locked` INTEGER UNSIGNED NULL DEFAULT 0;