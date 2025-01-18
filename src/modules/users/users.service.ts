import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/error/errorHandler';
import { letsDecrypt } from '../../utils/security';
import User, { IUser } from '../../DB/models/user.model';

export const getProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;

    // phone decryption
    const phone = letsDecrypt(user.phone);

    // I don't want to send password in response for aesthetic reasons :D.
    return res.status(200).json({ status: 'success', data: { ...user, phone, password: undefined } });
});

export const updateProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;
    const data = req.body as IUser;

    const updatedUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: { ...data } }, { new: true }).exec();

    return res.status(200).json({ status: 'success', data: updatedUser });
});
