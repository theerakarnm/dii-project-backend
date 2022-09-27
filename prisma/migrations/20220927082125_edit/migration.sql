-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT E'';

-- CreateTable
CREATE TABLE "Diaries" (
    "diaryId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersUsername" TEXT,

    CONSTRAINT "Diaries_pkey" PRIMARY KEY ("diaryId")
);

-- AddForeignKey
ALTER TABLE "Diaries" ADD CONSTRAINT "Diaries_usersUsername_fkey" FOREIGN KEY ("usersUsername") REFERENCES "Users"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeBy" ADD CONSTRAINT "LikeBy_username_fkey" FOREIGN KEY ("username") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_username_fkey" FOREIGN KEY ("username") REFERENCES "Users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
