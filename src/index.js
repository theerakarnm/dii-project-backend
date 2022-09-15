import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import * as router from './routers';

const app = express();
const PORT = process.env.PORT;

// express config
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 10000,
    max: 200,
    message: 'Too many requests from this IP, please try again',
  })
);

app.use('/auth', router.authRouter);
app.use('/post', router.postRouter);

// test
app.get('/testGet', (req, res) => {
  return res.send('get success');
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
