import bcrypt from 'bcryptjs';

const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(+process.env.SALT!);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

const comparePassword = (password: string, hashedPassword: string) => {
  const match = bcrypt.compareSync(password, hashedPassword);
  return match;
};

export { hashPassword, comparePassword };
