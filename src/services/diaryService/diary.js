import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../../configs/connectStorage';
import { v4 } from 'uuid';

dotenv.config();

const prisma = new PrismaClient();

export const _add = async (data) => {
  try {
    const storageUrl =
      'https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/';

    const uniqueString = v4();

    const storage = !data.buffer
      ? { error: false }
      : await storageClient
          .from('dii-project-bucket')
          .upload(`diary/${uniqueString}.${data.tail}`, data.buffer, {
            cacheControl: '3600',
            upsert: false,
          });

    if (storage.error) throw new Error(storage.error);

    const imageUrl = !data.buffer ? '' : `${storageUrl}${storage.data.Key}`;

    const result = await prisma.diaries.create({
      data: {
        imageUrl,
        assignTo: data.assignTo,
        assignBy: data.owner,
      },
    });
    return {
      isOk: true,
      data: result,
      msg: 'create success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'internal error on add diary service',
    };
  }
};

export const _getListByUsername = async ({ owner }) => {
  try {
    const result = await prisma.diaries.findMany({
      where: {
        assignTo: owner,
      },
    });

    return {
      isOk: true,
      data: result,
      msg: 'create success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'internal error on add diary service',
    };
  }
};
