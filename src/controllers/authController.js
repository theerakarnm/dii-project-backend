import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import { httpStatus } from "../configs/httpStatus";
import { getOneCredential, addUser } from "../services/userService";
import { decodePassword } from "../libs/DecryptEncryptString";

const register = async (req, res) => {
  const data = req.body;
  try {
    const resResult = await addUser(data);

    return res.status(httpStatus.created).send(resResult);
  } catch (e) {
    console.log(e);
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: "internal error on register",
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data } = await getOneCredential(username);

    if (!data)
      return res.status(httpStatus.forbidden).send({
        isOk: false,
        msg: "user not found",
      });

    const isPasswordMatch = await decodePassword(password, data.password);

    if (data.username !== username || !isPasswordMatch)
      return res.status(httpStatus.forbidden).send({
        isOk: false,
        msg: "username or password not match",
      });

    const secret = process.env.JWT_SECRET;

    if (!secret)
      return res.send({
        status: httpStatus.internalServerError,
        data: null,
        message: "the key is not found",
      });

    const token = jwt.sign(
      {
        username: data.username,
        email: data.email,
      },
      secret,
      { expiresIn: "240h" }
    );

    return res.status(httpStatus.ok).send({
      isOk: false,
      data: {
        token,
        username: data.username,
        firstName: data.fname,
        lastName: data.lname,
      },
      msg: "ok",
    });
  } catch (e) {
    return res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: "internal error on login",
    });
  }
};

export { register, login };
