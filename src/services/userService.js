import moment from 'moment';
import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../configs/connectStorage';
import { v4 } from 'uuid';

import { hashString, decodePassword } from '../libs/DecryptEncryptString';
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
  } finally {
    prisma.$disconnect();
  }
};

const _addUser = async (data) => {
  try {
    const randString = v4();

    const [hashedPassword, png] = await Promise.all([
      hashString(data.password),
      randAvatar(randString),
    ]);
    const storageUrl = process.env.SUPABASE_URL + '/storage/v1/object/public/';

    const x = await storageClient
      .from('dii-project-bucket')
      .upload(`avatar/${randString}.png`, png, {
        cacheControl: '3600',
        upsert: false,
      });
    console.log({ x: x.cause, storageUrl });

    if (x.error) throw new Error(x.error);

    const imageUrl = `${storageUrl}${x.data.Key}`;

    console.log(imageUrl);

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
  } finally {
    prisma.$disconnect();
  }
};

const _editSingle = async (username, { fname, lname, bio }) => {
  try {
    let config = {
      where: {
        username,
      },
      data: {},
    };

    !!fname ? (config.data.fname = fname) : null;
    !!lname ? (config.data.lname = lname) : null;
    !!bio ? (config.data.bio = bio) : null;

    await prisma.users.update(config);

    return {
      isOk: true,
      msg: 'update success',
    };
  } catch (e) {
    return {
      isOk: false,
      msg: 'error on edit single service',
    };
  } finally {
    prisma.$disconnect();
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
  } finally {
    prisma.$disconnect();
  }
};

const _fullTextSearch = async ({ context }) => {
  try {
    const res = await prisma.users.findMany({
      where: {
        OR: [
          {
            username: {
              startsWith: context,
            },
          },
          {
            username: {
              contains: context,
            },
          },
          {
            username: {
              search: context,
            },
          },
          {
            fname: {
              startsWith: context,
            },
          },
          {
            fname: {
              contains: context,
            },
          },
          {
            fname: {
              search: context,
            },
          },
          {
            lname: {
              startsWith: context,
            },
          },
          {
            lname: {
              contains: context,
            },
          },
          {
            lname: {
              search: context,
            },
          },
        ],
      },
    });

    return {
      isOk: true,
      data: res,
      msg: 'search success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'error on full text search service user',
    };
  } finally {
    prisma.$disconnect();
  }
};

const _updatePassword = async ({ username, oldPassword, newPassword }) => {
  try {
    const hashPassword = await hashString(newPassword);

    const data = await prisma.users.findUnique({
      where: {
        username,
      },
      select: {
        password: true,
      },
    });

    const isMatch = await decodePassword(oldPassword, data.password);

    if (!isMatch)
      return {
        isOk: false,
        msg: 'password is not match',
      };

    await prisma.users.update({
      where: {
        username,
      },
      data: {
        password: hashPassword.hash,
      },
    });

    return {
      isOk: true,
      msg: 'update password success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'internal error on update password service',
    };
  } finally {
    prisma.$disconnect();
  }
};

export {
  _addUser,
  _getOne,
  _updateSingle,
  _fullTextSearch,
  _editSingle,
  _updatePassword,
};
