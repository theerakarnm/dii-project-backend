import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import storageClient from '../../configs/connectStorage';
import { v4 } from 'uuid';

dotenv.config();

const prisma = new PrismaClient();

export const getListPerPost = ({ postId }) => {};

export const getOne = ({ commentId }) => {};

export const addNewComment = async ({ owner, postId, content }) => {
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
  }
};

export const getCommentPerPost = async (postId) => {
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
  }
};
