import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-avataaars-sprites";
import svgToImg from "svg-to-img";

const randAvatar = async (name) => {
  let svg = createAvatar(style, {
    seed: `${name}${~~Math.random()}`,
  });

  return await svgToImg.from(svg).toPng({
    width: 500,
    height: 500,
  });
};

export default randAvatar;
