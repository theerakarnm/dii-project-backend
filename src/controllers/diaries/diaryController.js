import { _ } from 'ajv';
import dotenv from 'dotenv';

dotenv.config();

import { httpStatus } from '../../configs/httpStatus';
import formatDataFunction from '../../libs/formatDateFromNow';

const newDiary = (req, res) => {
  const diaryImage = req.file;
  try {
    const [_, tail] = !diaryImage
      ? [null, null]
      : diaryImage?.mimetype.split('/');
  } catch (e) {
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on controller diary new',
    });
  }
};

const getOne = (req, res) => {
  try {
  } catch (e) {
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on controller diary get one',
    });
  }
};

const getListPerUser = (req, res) => {
  try {
  } catch (e) {
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on controller diary get list',
    });
  }
};

export { newDiary, getOne, getListPerUser };
