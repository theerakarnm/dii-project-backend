import moment from "moment";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

import { hashString } from "../libs/DecryptEncryptString";

dotenv.config();

const prisma = new PrismaClient();

const getOneCredential = async (username) => {
  try {
    const userData = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    return {
      isOk: true,
      data: userData,
      msg: userData == null ? "no error but user not found" : "",
    };
  } catch (e) {
    return {
      isOk: false,
      data: null,
      msg: "Internal error",
    };
  }
};

const addUser = async (data) => {
  try {
    const hashedPassword = await hashString(data.password);

    await prisma.users.create({
      data: {
        fname: data.fname,
        lname: data.lname,
        username: data.username,
        password: hashedPassword.hash,
      },
    });
    return {
      isOk: true,
      msg: "create success",
    };
  } catch (e) {
    return {
      isOk: false,
      msg: "Internal Error on add user service",
    };
  }
};
export { addUser, getOneCredential };
