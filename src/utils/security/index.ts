import * as bcrypt from './passwordHashing';
import * as crypto from './phoneEncryption';

export const passwordHashing = (password: string) => {
  return bcrypt.hashPassword(password);
};

export const passwordComparing = (password: string, hash: string) => {
  return bcrypt.comparePassword(password, hash);
};

export const letsEncrypt = (text: string) => {
  return crypto.encrypt(text);
};
export const letsDecrypt = (encrypted_text: string) => {
  return crypto.decrypt(encrypted_text);
};
