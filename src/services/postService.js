import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import storageClient from "../configs/connectStorage";
import { v4 } from "uuid";

dotenv.config();

const prisma = new PrismaClient();

const addPost = async (data) => {
  const storageUrl =
    "https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/";

  const x = await storageClient
    .from("dii-project-bucket")
    .upload(`post/${v4()}.${data.tail}`, data.buffer, {
      cacheControl: "3600",
      upsert: false,
    });

  if (x.error) throw new Error(x.error);

  const imageUrl = `${storageUrl}${x.data.Key}`;

  prisma.posts.create({
    data: {
      usersId: 0,
      postContent: data.content,
      imageUrl,
    },
  });
};

export { addPost };
