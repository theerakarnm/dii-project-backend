import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../../configs/connectStorage';
import { v4 } from 'uuid';

dotenv.config();

const prisma = new PrismaClient();

const _add = async (data) => {
  try {
    const storageUrl = process.env.SUPABASE_URL + '/storage/v1/object/public/';

    const uniqueString = v4();

    const storage = !data.buffer
      ? { error: false }
      : await storageClient
          .from('dii-project-bucket')
          .upload(`post/${uniqueString}.${data.tail}`, data.buffer, {
            cacheControl: '3600',
            upsert: false,
          });

    if (storage.error) throw new Error(storage.error);

    const imageUrl = !data.buffer ? '' : `${storageUrl}${storage.data.Key}`;

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
  } finally {
    prisma.$disconnect();
  }
};

const _getRecentPost = async () => {
  try {
    const res = await prisma.posts.findMany({
      orderBy: {
        dateTime: 'desc',
      },
      select: {
        id: true,
        postContent: true,
        imageUrl: true,
        likeCount: true,
        dateTime: true,
        Users: {
          select: {
            username: true,
            avatar: true,
            fname: true,
            lname: true,
          },
        },
        likeBy: true,
        comment: {
          take: 3,
          select: {
            id: true,
            Users: true,
            content: true,
            dataTime: true,
          },
          orderBy: {
            dataTime: 'desc',
          },
        },
      },
    });

    return {
      isOk: true,
      data: res,
      msg: '',
    };
  } catch (e) {
    console.log(e);

    return {
      isOk: false,
      msg: 'Internal Error on get most like service',
    };
  } finally {
    prisma.$disconnect();
  }
};

const _getOne = async (postId) => {
  try {
    const res = await prisma.posts.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        postContent: true,
        imageUrl: true,
        likeCount: true,
        dateTime: true,
        Users: {
          select: {
            username: true,
            avatar: true,
            fname: true,
            lname: true,
          },
        },
        likeBy: true,
        comment: {
          take: 3,
          select: {
            id: true,
            Users: true,
            content: true,
            dataTime: true,
          },
          orderBy: {
            dataTime: 'desc',
          },
        },
      },
    });

    return {
      isOk: true,
      data: res,
      msg: 'get success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'internal error on get one post service',
    };
  } finally {
    prisma.$disconnect();
  }
};

const _update = async ({ id, newContent }) => {
  try {
    await prisma.posts.update({
      where: {
        id,
      },
      data: {
        postContent: newContent,
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
      msg: 'internal error on update post service',
    };
  } finally {
    prisma.$disconnect();
  }
};

const _delete = async ({ id }) => {
  try {
    await prisma.$transaction([
      prisma.likeBy.deleteMany({
        where: {
          postsId: id,
        },
      }),
      prisma.comments.deleteMany({
        where: {
          postsId: id,
        },
      }),
      prisma.posts.delete({
        where: {
          id,
        },
      }),
    ]);

    return {
      isOk: true,
      msg: 'delete success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'internal error on delete post service',
    };
  } finally {
    prisma.$disconnect();
  }
};

export { _add, _getRecentPost, _update, _delete, _getOne };
