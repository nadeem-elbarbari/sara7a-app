import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/error/errorHandler';
import User from '../../DB/models/user.model';
import { Message } from '../../DB/models/messages.model';

export const sendMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { content, userId } = req.body;

    const isUser = await User.findById(userId).exec();

    if (!isUser) {
        const error = new Error('this user not exist', { cause: 400 });
        return next(error);
    }

    const data = await Message.create({ content, userId });

    res.status(201).json({ status: 'success', message: 'message sent successfully', data });
});

export const getMessages = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const messages = await Message.find({ userId: req.user._id }).exec();

    if (!messages) {
        const error = new Error('messages not found', { cause: 404 });
        return next(error);
    }

    res.status(200).json({ status: 'success', data: messages });
});
