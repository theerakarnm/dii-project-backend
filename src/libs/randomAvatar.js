import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-avataaars-sprites';

const randAvatar = async (name) => {
  let svg = createAvatar(style, {
    seed: `${name}${~~Math.random()}`,
  });

  return Buffer.from(svg, 'utf-8');
};

export default randAvatar;
