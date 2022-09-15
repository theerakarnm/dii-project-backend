import bcrypt from 'bcryptjs';
export const hashString = async (str) => {
  const SALT_ROUNDS = 0.4231;
  const hash = await bcrypt.hash(str, SALT_ROUNDS);
  return {
    hash,
    salt: SALT_ROUNDS,
  };
};

export const decodePassword = (str, hash) => {
  return bcrypt.compare(str, hash);
};
