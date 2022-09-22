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
