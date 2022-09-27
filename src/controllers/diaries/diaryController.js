import { _ } from 'ajv';
import dotenv from 'dotenv';

dotenv.config();

import { httpStatus } from '../../configs/httpStatus';
import formatDataFunction from '../../libs/formatDateFromNow';
import { _add } from '../../services/diaryService/diary';

const newDiary = async (req, res) => {
  const { file } = req;
  const { assignTo } = req.body;
  try {
    const [_, tail] = !file ? [null, null] : file?.mimetype.split('/');

    console.log({
      owner: req.jwtObject.username,
      tail,
      buffer: file?.buffer || null,
      assignTo,
    });

    const result = await _add({
      owner: req.jwtObject.username,
      tail,
      buffer: file?.buffer || null,
      assignTo,
    });

    if (!result.isOk)
      return res.status(httpStatus.internalServerError).send({
        isOk: false,
        msg: 'isOk is false on controller diary get one',
      });

    res.status(httpStatus.ok).send(result);
  } catch (e) {
    console.error(e);
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on controller diary new',
    });
  }
};

const getOne = (req, res) => {
  try {
    res.sendStatus(httpStatus.notImplemented);
  } catch (e) {
    console.error(e);
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on controller diary get one',
    });
  }
};

const getListPerUser = (req, res) => {
  try {
    res.sendStatus(httpStatus.notImplemented);
  } catch (e) {
    console.error(e);
    res.status(httpStatus.internalServerError).send({
      isOk: false,
      msg: 'internal error on controller diary get list',
    });
  }
};

export { newDiary, getOne, getListPerUser };
