import moment from 'moment';
import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../configs/connectStorage';
import { v4 } from 'uuid';

import { hashString } from '../libs/DecryptEncryptString';
import randAvatar from '../libs/randomAvatar';

dotenv.config();

const prisma = new PrismaClient();

const _getOne = async (username, select = {}) => {
  try {
    const config = {
      where: {
        username,
      },
    };

    select !== {} ? (config.select = select) : null;

    const [userData, countDiary] = await prisma.$transaction([
      prisma.users.findUnique(config),
      prisma.diaries.count({
        where: {
          assignTo: username,
        },
      }),
    ]);

    return {
      isOk: true,
      data: { ...userData, countDiary },
      msg: userData == null ? 'no error but user not found' : '',
    };
  } catch (e) {
    return {
      isOk: false,
      data: null,
      msg: 'Internal error',
    };
  }
};

const _addUser = async (data) => {
  try {
    const randString = v4();

    const [hashedPassword, png] = await Promise.all([
      hashString(data.password),
      randAvatar(randString),
    ]);
    const storageUrl =
      'https://oijsgpmyxcrqexaewofb.supabase.co/storage/v1/object/public/';

    const x = await storageClient
      .from('dii-project-bucket')
      .upload(`avatar/${randString}.png`, png, {
        cacheControl: '3600',
        upsert: false,
      });

    if (x.error) throw new Error(x.error);

    const imageUrl = `${storageUrl}${x.data.Key}`;

    await prisma.users.create({
      data: {
        fname: data.firstName,
        lname: data.lastName,
        email: data.email,
        avatar: imageUrl,
        username: data.username,
        password: hashedPassword.hash,
      },
    });
    return {
      isOk: true,
      msg: 'create success',
    };
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        return {
          success: false,
          data: {},
          msg: `This ${e.meta.target.join(',')} is already taken`,
        };
      }
      return {
        success: false,
        data: {},
      };
    }

    return {
      success: false,
      data: {},
      msg: 'Internal Server Error Agent',
    };
  }
};

const _updateSingle = async ({ username, content }) => {
  try {
    await prisma.users.update({
      where: {
        username: username,
      },
      data: {
        fname: content.fname,
        lname: content.lname,
        email: content.email,
        bio: content.bio,
      },
    });

    return {
      isOk: true,
      msg: 'update success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'error on update single service',
    };
  }
};

const _fullTextSearch = async ({ context }) => {
  try {
    const res = await prisma.$transaction([
      prisma.users.findMany({
        where: {
          fname: {
            search: context,
          },
        },
      }),
      prisma.users.findMany({
        where: {
          lname: {
            search: context,
          },
        },
      }),
      prisma.users.findMany({
        where: {
          username: {
            search: context,
          },
        },
      }),
    ]);

    const format = [...new Set(...res[0], ...res[1], ...res[2])];

    return {
      isOk: true,
      data: format,
      msg: 'search success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'error on full text search service user',
    };
  }
};

export { _addUser, _getOne, _updateSingle, _fullTextSearch };
