import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/error/errorHandler';
import User, { IUser } from '../../DB/models/user.model';
import { generateToken, letsEncrypt, passwordComparing, passwordHashing, verifyToken } from '../../utils/security';
import { sendEmail } from '../../utils/mail/sendEmail';
import { JwtPayload } from 'jsonwebtoken';
import emitter from '../../utils/events/emailEvent';

export const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // input validation
    const data = req.body as IUser;

    // email verification
    const user = await User.findOne({ email: data.email });

    if (user) {
        const error = new Error('Email is already exist', { cause: 400 });
        return next(error);
    }

    // password hashing
    const hashedPassword = passwordHashing(data.password);

    // phone encryption
    const encryptedPhone = letsEncrypt(data.phone);

    // user creation
    const newUser: IUser = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: encryptedPhone,
        gender: data.gender,
        role: data.role,
    });

    // user saving
    await newUser.save();

    // confirmation token generation
    const token = generateToken({ email: newUser.email }, process.env.CONFIRMATION_TOKEN!);

    // email sending with confirmation link
    const link = `${req.protocol}://${req.get('host')}/auth/verify/${token}`;

    emitter.emit('sendEmail', [newUser.email, link], newUser);

    return res
        .status(201)
        .json({ status: 'success', message: 'check your email to confirm your account', data: newUser });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;

    // token verification
    const verifiedToken = verifyToken(token, process.env.CONFIRMATION_TOKEN!) as JwtPayload;

    if (!verifiedToken) {
        const error = new Error('invalid token', { cause: 401 });
        return next(error);
    }

    // user verification
    const user = (await User.findOne({ email: verifiedToken.email }).exec()) as IUser | null;

    if (!user) {
        const error = new Error('invalid token', { cause: 401 });
        return next(error);
    }

    // user confirmation
    if (user.isConfirmed) {
        const error = new Error('your account is already confirmed', { cause: 400 });
        return next(error);
    }

    user.isConfirmed = true;
    user.confirmedAt = new Date(Date.now());
    await user.save();

    return res.status(200).json({ status: 'success', message: 'your account has been verified' });
});

export const logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // user verification
    const data = req.body as IUser;

    const user = (await User.findOne({ email: data.email }).exec()) as IUser | null;

    if (!user) {
        const error = new Error('wrong email or password', { cause: 404 });
        return next(error);
    }

    // password verification
    const match = passwordComparing(data.password, user.password);

    if (!match) {
        const error = new Error('wrong email or password', { cause: 404 });
        return next(error);
    }

    // token generation
    const token = generateToken(
        { email: user.email, id: user._id },
        user.role === 'admin' ? process.env.ADMIN_SIGNATURE! : process.env.USER_SIGNATURE!
    );

    return res.status(200).json({ status: 'success', token });
});
