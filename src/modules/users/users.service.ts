import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/error/errorHandler';
import { letsDecrypt, letsEncrypt } from '../../utils/security';
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

    if (Object.keys(data).length === 0) {
        const error = new Error('please provide at least one field to update', { cause: 400 });
        delete error.stack;
        return next(error);
    }

    if (data.phone) {
        data.phone = letsEncrypt(data.phone);
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: user._id }, data, {
        new: true,
        projection: { name: 1, email: 1, phone: 1, gender: 1 },
    }).exec();

    updatedUser.phone = letsDecrypt(updatedUser.phone);

    return res.status(200).json({ status: 'success', message: 'profile updated', data: updatedUser });
});
