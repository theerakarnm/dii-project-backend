import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../../configs/connectStorage';
import { v4 } from 'uuid';

dotenv.config();

const prisma = new PrismaClient();

export const _add = async ({ fileData }) => {
  try {
    const storageUrl =
      'https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/';

    const uniqueString = v4();

    const storage = !fileData.buffer
      ? { error: false }
      : await storageClient
          .from('dii-project-bucket')
          .upload(`diary/${uniqueString}.${fileData.tail}`, fileData.buffer, {
            cacheControl: '3600',
            upsert: false,
          });

    if (storage.error) throw new Error(storage.error);

    const imageUrl = !fileData.buffer ? '' : `${storageUrl}${storage.data.Key}`;
  } catch (e) {
    return {
      isOk: false,
      msg: 'internal error on add diary service',
    };
  }
};
