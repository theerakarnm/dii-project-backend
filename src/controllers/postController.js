import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

import { httpStatus } from '../configs/httpStatus';
import { addPost, getMostLike } from '../services/postService';

const newPost = async (req, res) => {
  const { file, body } = req;

  console.log(file);
  try {
    const [_, tail] = file.mimetype.split('/');

    const result = await addPost({
      owner: req.jwtObject.username,
      tail,
      buffer: file.buffer,
      content: body.textContent,
    });

    if (!result.isOk)
      return res.status(httpStatus.ok).send({
        isOk: false,
        msg: result.msg,
      });

    return res.status(httpStatus.ok).send({
      isOk: true,
      data: result.data,
      msg: result.msg,
    });
  } catch (e) {
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on new post',
    });
  }
};

const getPopular = async (req, res) => {
  try {
    const result = await getMostLike();

    if (!result.isOk)
      return res.status(httpStatus.ok).send({
        isOk: false,
        msg: result.msg,
      });

    const format = result.data.map((item) => {
      return {
        id: item.id,
        username: item.Users.username,
        name: `${item.Users.fname} ${item.Users.lname}`,
        profileImage: item.Users.avatar,
        dateTime: item.dateTime,
        postContent: item.postContent,
        imageUrl: item.imageUrl || null,
        comment: [],
      };
    });

    return res.status(httpStatus.ok).send({
      isOk: true,
      data: format,
      msg: result.msg,
    });
  } catch (e) {
    console.log(e);
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on top like',
    });
  }
};

export { newPost, getPopular };
