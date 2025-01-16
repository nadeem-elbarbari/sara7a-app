import CryptoJS from "crypto-js";

export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, process.env.PHONE_ENCRYPT_KEY!).toString();
}

export const decrypt = (encrypted_text: string) => {
  return CryptoJS.AES.decrypt(encrypted_text, process.env.PHONE_ENCRYPT_KEY!).toString(CryptoJS.enc.Utf8)
}