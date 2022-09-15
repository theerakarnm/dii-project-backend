import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

import { httpStatus } from "../configs/httpStatus";
import { addPost } from "../services/postService";

const newPost = async (req, res) => {
  const { file, body } = req;

  console.log(file);
  try {
    const [_, tail] = file.mimetype.split("/");

    await addPost({ tail, buffer: file.buffer, content: body.textContent });

    return res.status(httpStatus.ok).send({
      isOk: true,
      msg: "",
    });
  } catch (e) {
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: "internal error on new post",
    });
  }
};

export { newPost };
