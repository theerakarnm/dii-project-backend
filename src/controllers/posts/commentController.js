import { _ } from 'ajv';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

import { httpStatus } from '../../configs/httpStatus';
import formatDataFunction from '../../libs/formatDateFromNow';
import * as postService from '../../services/postService';
import { _getCommentPerPost } from '../../services/postService/comment';

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
    const { postId } = req.params;

    const result = await _getCommentPerPost({ postId });

    if (!result.isOk) return res.status(httpStatus.badRequest).send(result);

    const commentFormat = result.data.map((comment) => {
      const formatDataC = formatDataFunction(comment.dataTime);
      return {
        id: comment.id,
        name: `${comment.Users.fname} ${comment.Users.lname}`,
        profileImage: comment.Users.avatar,
        content: comment.content,
        dateTime: formatDataC,
      };
    });

    res.status(httpStatus.ok).send({
      ...result,
      data: commentFormat,
    });
  } catch (e) {
    console.error(e);
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on get comment on post controller',
    });
  }
};

export { newComment, getCommentPerPost };
