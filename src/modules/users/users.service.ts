import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/error/errorHandler';
import {
    generateToken,
    letsDecrypt,
    letsEncrypt,
    passwordComparing,
    passwordHashing,
    verifyToken,
} from '../../utils/security';
import User, { IUser } from '../../DB/models/user.model';
import { IChangePassword } from './users.validation';
import emitter from '../../utils/events/emailEvent';

export const getProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;

    // phone decryption
    const phone = letsDecrypt(user.phone);

    return res.status(200).json({ status: 'success', data: { ...user, phone } });
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

export const updatePassword = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;
    const data = req.body as IChangePassword;

    // password verification
    const match = passwordComparing(data.oldPassword, user.password);

    if (!match) {
        const error = new Error("Old password isn't correct", { cause: 400 });
        return next(error);
    }

    // updating password
    const newPassword = passwordHashing(data.password);

    await User.findByIdAndUpdate(user._id, { $set: { password: newPassword } });

    return res.status(200).json({ status: 'success', message: 'password updated successfully' });
});

export const softDelete = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { $set: { isDeleted: true } });

    res.status(200).json({ status: 'success', message: 'account deleted successfully' });
});

export const requestOTP = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Function to generate a random OTP
    function generateOTP(): string {
        const otp: number = Math.floor(1000 + Math.random() * 9000);
        return otp.toString();
    }

    const otp_: string = generateOTP();

    // Store OTP and expiry in the user's document
    const user: IUser | null = await User.findOne({ email }).exec();

    if (!user) {
        const error = new Error('user not found', { cause: 404 });
        return next(error);
    }

    const otpToken: string = generateToken({ otpCode: otp_ }, process.env.OTP_SIGNATURE!, 60 * 60 * 5);

    // Store OTP and expiry in the user's document
    await User.findOneAndUpdate({ email }, { $set: { OTP: otpToken } });

    // Send OTP email
    emitter.emit(
        'sendEmail',
        email,
        'Password reset',
        `
        <h1>OTP for password reset 🥲</h1>
        <p style="font-size: 15px; font-weight: bold;">Hi ${user.name} 👋,</p>
        <p style="font-size: 20px;">please use the following OTP to reset your password 👇</p>
        <p style="font-size: 40px; font-weight: bold;">${otp_}</p>
        <p style="font-size: 25px; color: red; text-decoration: underline">⚠️ This OTP will expire in 5 minutes</p>
        `
    );

    // Respond to the client
    return res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});

export const resetPassword = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { email, otp, newPassword } = req.body;

    const user: IUser | null = await User.findOne({ email }).exec();

    if (!user) {
        const error = new Error('user not found', { cause: 404 });
        return next(error);
    }

    // Verify OTP

    if (!user.OTP) {
        const error = new Error('Invalid or expired OTP', { cause: 404 });
        return next(error);
    }

    const { otpCode, exp } = verifyToken(user.OTP!, process.env.OTP_SIGNATURE!) as any;

    const currentDate = new Date();

    if (Math.floor(currentDate.getTime() / 1000) >= exp) {
        const error = new Error('OTP expired', { cause: 400 });
        await User.findByIdAndUpdate(user._id, { $set: { OTP: undefined } });
        return next(error);
    }

    if (otp !== otpCode) {
        const error = new Error('Invalid or expired OTP', { cause: 400 });
        return next(error);
    }

    // Update password
    const updatedPassword = passwordHashing(newPassword);
    await await User.findByIdAndUpdate(user._id, {
        $set: {
            password: updatedPassword, // Set this field to a new value
        },
        $unset: {
            OTP: 1, // Delete this field
        },
    });

    return res.status(200).json({ status: 'success', message: 'password updated successfully' });
});

export const shareProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user: IUser | null = await User.findById(id).select('name email phone gender role').exec();

    if (!user) {
        const error = new Error('user not found', { cause: 404 });
        return next(error);
    }

    user.phone = letsDecrypt(user.phone);

    return res.status(200).json({ status: 'success', data: user });
});
