import { _ } from 'ajv';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

import { httpStatus } from '../../configs/httpStatus';
import formatDataFunction from '../../libs/formatDateFromNow';
import * as postService from '../../services/postService';

// like
const updateLike = async (req, res) => {
  try {
    const { postId, num } = req.body;

    const result = await postService.like._update({
      postsId: postId,
      num,
      username: req.jwtObject.username,
    });

    if (!result.isOk)
      return res.status(httpStatus.internalServerError).send({
        isOk: false,
        msg: result.msg,
      });

    return res.status(httpStatus.ok).send({
      isOk: true,
      msg: 'updateLike success',
    });
  } catch (e) {
    console.log(e);

    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on updateLike',
    });
  }
};

export { updateLike };
