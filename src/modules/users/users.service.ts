import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/error/errorHandler';
import User, { IUser } from '../../DB/models/user.model';
import { letsDecrypt, letsEncrypt, passwordComparing, passwordHashing } from '../../utils/security';
import { Models, Document } from 'mongoose';

export const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, phone, gender, role } = req.body as IUser;

  const user = await User.findOne({ email: email });

  if (user) {
    const error = new Error('Email is already exist', { cause: 400 });
    return next(error);
  }

  const hashedPassword = passwordHashing(password);

  const encryptedPhone = letsEncrypt(phone);

  const newUser = new User({ name, email, password: hashedPassword, phone: encryptedPhone, gender, role });

  await newUser.save();

  return res.status(201).json({ status: 'success', data: newUser });
});

export const logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as IUser;

  const user = (await User.findOne({ email: email }).exec()) as IUser | null;
  
  if (!user) {
    const error = new Error('wrong email or password', { cause: 404 });
    return next(error);
  }

  const match = passwordComparing(password, user.password);

  if (!match) {
    const error = new Error('wrong email or password', { cause: 404 });
    return next(error);
  }

  const decryptedPhone = letsDecrypt(user.phone);

  return res.status(200).json({ status: 'success', data: { ...user.toObject(), phone: decryptedPhone } });
});
