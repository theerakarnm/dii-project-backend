import { _ } from 'ajv';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

import { httpStatus } from '../../configs/httpStatus';
import formatDataFunction from '../../libs/formatDateFromNow';
import * as postService from '../../services/postService';

// post
const newPost = async (req, res) => {
  const { file, body } = req;

  console.log(file);
  try {
    const [_, tail] = !file ? [null, null] : file?.mimetype.split('/');

    const result = await postService.post.addPost({
      owner: req.jwtObject.username,
      tail,
      buffer: file?.buffer || null,
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
    console.error(e);
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on new post',
    });
  }
};

const deletePost = async (req, res) => {
  try {
    res.status(httpStatus.notImplemented).send({});
  } catch (e) {
    console.log(e);
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'error on delete post controller',
    });
  }
};

const updatePost = async (req, res) => {
  try {
    res.status(httpStatus.notImplemented).send({});
  } catch (e) {
    console.log(e);
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'error on update post controller',
    });
  }
};

const getPopular = async (req, res) => {
  try {
    const result = await postService.post.getMostLike();

    if (!result.isOk)
      return res.status(httpStatus.ok).send({
        isOk: false,
        msg: result.msg,
      });
    const format = result.data.map((item) => {
      const formatData = formatDataFunction(item.dateTime);

      console.log({ like: item.likeBy.map((item) => item.username) });
      console.log({
        like2: item.likeBy
          .map((item) => item.username)
          .includes(req.jwtObject.username),
      });
      console.log({ comment: item.comment });
      return {
        id: item.id,
        username: item.Users.username,
        name: `${item.Users.fname} ${item.Users.lname}`,
        profileImage: item.Users.avatar,
        dateTime: formatData,
        postContent: item.postContent,
        isLike: item.likeBy
          .map((item) => item.username)
          .includes(req.jwtObject.username),
        likeContent: {
          likeCount: item.likeBy.length,
          likedBy: item.likeBy,
        },
        imageUrl: item.imageUrl || null,
        comment: item.comment.map((comment) => {
          const formatDataC = formatDataFunction(comment.dataTime);
          return {
            id: comment.id,
            name: `${comment.Users.fname} ${comment.Users.lname}`,
            profileImage: comment.Users.avatar,
            content: comment.content,
            dateTime: formatDataC,
          };
        }),
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

const getRecent = async (req, res) => {
  try {
    const result = await postService.post.getRecentPost();

    if (!result.isOk)
      return res.status(httpStatus.ok).send({
        isOk: false,
        msg: result.msg,
      });
    const format = result.data.map((item) => {
      const formatData = formatDataFunction(item.dateTime);
      return {
        id: item.id,
        username: item.Users.username,
        name: `${item.Users.fname} ${item.Users.lname}`,
        profileImage: item.Users.avatar,
        dateTime: formatData,
        postContent: item.postContent,
        isLike: item.likeBy
          .map((item) => item.username)
          .includes(req.jwtObject.username),
        likeContent: {
          likeCount: item.likeBy.length,
          likedBy: item.likeBy,
        },
        imageUrl: item.imageUrl || null,
        hasMoreComment: item.comment.length >= 3 ? true : false,
        comment: item.comment.map((comment) => {
          const formatDataC = formatDataFunction(comment.dataTime);
          return {
            id: comment.id,
            name: `${comment.Users.fname} ${comment.Users.lname}`,
            profileImage: comment.Users.avatar,
            content: comment.content,
            dateTime: formatDataC,
          };
        }),
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
      msg: 'internal error on recent',
    });
  }
};

export { newPost, getPopular, getRecent, deletePost, updatePost };
