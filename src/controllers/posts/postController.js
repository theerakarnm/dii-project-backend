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
    if (!file && !body.textContent)
      return res.status(httpStatus.badRequest).send({
        isOk: false,
        msg: 'Please provide rather file or content',
      });

    console.log(file?.mimetype);

    const [_, tail] = !file ? [null, null] : file?.mimetype.split('/');

    const result = await postService.post._add({
      owner: req.jwtObject.username,
      tail,
      buffer: file?.buffer || null,
      content: body.textContent,
    });

    if (!result.isOk)
      return res.status(httpStatus.internalServerError).send({
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
  const { postId } = req.params;
  try {
    const result = await postService.post._delete({
      id: postId,
    });

    if (!result.isOk)
      return res.status(httpStatus.internalServerError).send(result);

    res.status(httpStatus.ok).send(result);
  } catch (e) {
    console.log(e);
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'error on delete post controller',
    });
  }
};

const updatePost = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;
  try {
    const result = await postService.post._update({
      id: postId,
      newContent: content,
    });

    if (!result.isOk)
      return res.status(httpStatus.internalServerError).send(result);

    res.status(httpStatus.ok).send(result);
  } catch (e) {
    console.log(e);
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'error on update post controller',
    });
  }
};
const getRecent = async (req, res) => {
  try {
    const result = await postService.post._getRecentPost();

    console.log(req.jwtObject);

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
            username: comment.Users.username,
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

const getById = async (req, res) => {
  const { postId } = req.params;
  try {
    if (!postId)
      return res.status(httpStatus.badRequest).send({
        isOk: false,
        msg: 'Post id is required',
      });

    const { data: result, isOk } = await postService.post._getOne(postId);

    if (!isOk)
      return res.status(httpStatus.internalServerError).send({
        isOk: false,
        msg: 'internal error on get by id controller',
      });

    const format = {
      id: result.id,
      username: result.Users.username,
      name: `${result.Users.fname} ${result.Users.lname}`,
      profileImage: result.Users.avatar,
      dateTime: formatDataFunction(result.dateTime),
      postContent: result.postContent,
      isLike: result.likeBy
        .map((result) => result.username)
        .includes(req.jwtObject.username),
      likeContent: {
        likeCount: result.likeBy.length,
        likedBy: result.likeBy,
      },
      imageUrl: result.imageUrl || null,
      hasMoreComment: result.comment.length >= 3 ? true : false,
      comment: result.comment.map((comment) => {
        const formatDataC = formatDataFunction(comment.dataTime);
        return {
          id: comment.id,
          name: `${comment.Users.fname} ${comment.Users.lname}`,
          username: comment.Users.username,
          profileImage: comment.Users.avatar,
          content: comment.content,
          dateTime: formatDataC,
        };
      }),
    };

    console.log(format);

    res.status(httpStatus.ok).send({
      ...result,
      data: format,
    });
  } catch (e) {
    console.log(e);
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on get one post',
    });
  }
};

export { newPost, getRecent, deletePost, updatePost, getById };
