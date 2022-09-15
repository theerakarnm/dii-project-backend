import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const auth = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    console.log('auth middleware request');
    const token = req.header('Authorization');

    if (!token)
      return res.status(403).send({
        success: false,
        msg: 'Access denied.',
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.jwtObject = decoded;

    next();
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: 'Invalid Token.',
    });
  }
};
