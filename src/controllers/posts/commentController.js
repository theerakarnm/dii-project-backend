import { _ } from 'ajv';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

import { httpStatus } from '../../configs/httpStatus';
import formatDataFunction from '../../libs/formatDateFromNow';
import * as postService from '../../services/postService';

// comment
const newComment = async (req, res) => {
  const { postId, content } = req.body;
  try {
    const result = await postService.comment._add({
      owner: req.jwtObject.username,
      postId,
      content,
    });

    return !result.isOk
      ? res.status(httpStatus.internalServerError).send(result)
      : res.status(httpStatus.created).send(result);
  } catch (e) {
    console.error(e);

    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on updateLike',
    });
  }
};

const getCommentPerPost = async (req, res) => {
  try {
    const { postId } = req.param;

    const res = getCommentPer;
  } catch (e) {
    console.error(e);
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on get comment on post controller',
    });
  }
};

export { newComment, getCommentPerPost };
