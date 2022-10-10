import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../../configs/connectStorage';
import { v4 } from 'uuid';

dotenv.config();

const prisma = new PrismaClient();

export const _getListPerPost = async ({ postId }) => {
  try {
    const res = await prisma.comments.findMany({
      where: {
        postsId: postId,
      },
      select: {
        id: true,
        Users: true,
        content: true,
        dataTime: true,
      },
      orderBy: {
        dataTime: 'desc',
      },
    });

    return {
      isOk: false,
      data: res,
      msg: 'success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'internal error',
    };
  } finally {
    prisma.$disconnect();
  }
};

export const _getOne = ({ commentId }) => {};

export const _add = async ({ owner, postId, content }) => {
  try {
    await prisma.comments.create({
      data: {
        content,
        username: owner,
        postsId: postId,
      },
    });

    return {
      isOk: true,
      msg: 'success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'internal error at addNewComment service',
    };
  } finally {
    prisma.$disconnect();
  }
};

export const _getCommentPerPost = async ({ postId }) => {
  try {
    const comment = await prisma.comments.findMany({
      where: {
        postsId: postId,
      },
      select: {
        id: true,
        Users: true,
        content: true,
        dataTime: true,
      },
      orderBy: {
        dataTime: 'desc',
      },
    });

    return {
      isOk: true,
      data: comment || [],
      msg: 'success',
    };
  } catch (e) {
    console.error(e);
    return {
      isOk: false,
      msg: 'internal error at getCommentPerPost service',
    };
  } finally {
    prisma.$disconnect();
  }
};
