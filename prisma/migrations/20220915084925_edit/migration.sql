-- AlterTable
CREATE SEQUENCE "posts_id_seq";
ALTER TABLE "Posts" ALTER COLUMN "id" SET DEFAULT nextval('posts_id_seq');
ALTER SEQUENCE "posts_id_seq" OWNED BY "Posts"."id";
