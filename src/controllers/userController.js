import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

import { httpStatus } from '../configs/httpStatus';
import { _getOne } from '../services/userService';
import formatData from '../libs/formatDateFromNow';

const getOne = async (req, res) => {
  console.log(req.params);
  const { userId } = req.params;
  try {
    const user = await _getOne(userId, {
      username: true,
      email: true,
      post: true,
      avatar: true,
      fname: true,
      lname: true,
    });

    console.log({ user });

    if (!user.isOk) return res.status(httpStatus.badRequest).send(user);
    if (!user.data)
      return res.status(httpStatus.noContent).send({
        isOk: true,
        data: null,
        msg: 'success',
      });

    const format = {
      name: `${user.data.fname} ${user.data.lname}`,
      profileUrl: user.data.avatar,
      postCount: user.data.post.length,
      diaryCount: 0,
      email: user.data.email,
      post: user.data.post.map((p) => {
        const formatDataC = formatData(p.dataTime);
        return {
          id: p.id,
          content: p.postContent,
          imageUrl: p.imageUrl,
          dateTime: formatDataC,
        };
      }),
    };

    console.log({ format });

    res.status(httpStatus.ok).send({
      isOk: true,
      data: format,
      msg: 'success',
    });
  } catch (e) {
    console.error(e);
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on get one user controller',
    });
  }
};

export { getOne };