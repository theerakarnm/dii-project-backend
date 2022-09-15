-- AlterTable
CREATE SEQUENCE "comments_id_seq";
ALTER TABLE "Comments" ALTER COLUMN "id" SET DEFAULT nextval('comments_id_seq');
ALTER SEQUENCE "comments_id_seq" OWNED BY "Comments"."id";

-- AlterTable
ALTER TABLE "Posts" ALTER COLUMN "imageUrl" DROP NOT NULL;
