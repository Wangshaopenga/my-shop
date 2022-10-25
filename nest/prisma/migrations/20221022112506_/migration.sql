/*
  Warnings:

  - You are about to drop the column `goodsId` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `goodsId` on the `orderdetails` table. All the data in the column will be lost.
  - You are about to drop the column `ordersId` on the `orderdetails` table. All the data in the column will be lost.
  - Added the required column `goodId` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goodId` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_goodsId_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_usersId_fkey`;

-- DropForeignKey
ALTER TABLE `orderdetails` DROP FOREIGN KEY `OrderDetails_goodsId_fkey`;

-- DropForeignKey
ALTER TABLE `orderdetails` DROP FOREIGN KEY `OrderDetails_ordersId_fkey`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `goodsId`,
    DROP COLUMN `usersId`,
    ADD COLUMN `goodId` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `userId` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `orderdetails` DROP COLUMN `goodsId`,
    DROP COLUMN `ordersId`,
    ADD COLUMN `goodId` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `orderId` INTEGER UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderDetails` ADD CONSTRAINT `OrderDetails_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetails` ADD CONSTRAINT `OrderDetails_goodId_fkey` FOREIGN KEY (`goodId`) REFERENCES `Goods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_goodId_fkey` FOREIGN KEY (`goodId`) REFERENCES `Goods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
