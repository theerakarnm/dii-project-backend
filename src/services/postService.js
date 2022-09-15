import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../configs/connectStorage';
import { v4 } from 'uuid';

dotenv.config();

const prisma = new PrismaClient();

const addPost = async (data) => {
  try {
    const storageUrl =
      'https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/';

    const uniqueString = v4();

    const storage = await storageClient
      .from('dii-project-bucket')
      .upload(`post/${uniqueString}.${data.tail}`, data.buffer, {
        cacheControl: '3600',
        upsert: false,
      });

    if (storage.error) throw new Error(storage.error);

    const imageUrl = `${storageUrl}${storage.data.Key}`;

    const result = await prisma.posts.create({
      data: {
        id: uniqueString,
        usersId: data.owner,
        postContent: data.content,
        imageUrl,
      },
    });
    return {
      isOk: true,
      data: result,
      msg: 'create success',
    };
  } catch (e) {
    console.log(e);

    return {
      isOk: false,
      msg: 'internal error on add post service',
    };
  }
};

const getMostLike = async (data) => {
  try {
    const res = await prisma.posts.findMany({
      orderBy: {
        likeCount: 'asc',
      },
    });

    return {
      isOk: true,
      data: res,
      msg: 'Internal Error on add user service',
    };
  } catch (e) {
    console.log(e);

    return {
      isOk: false,
      msg: 'Internal Error on add user service',
    };
  }
};

export { addPost, getMostLike };
