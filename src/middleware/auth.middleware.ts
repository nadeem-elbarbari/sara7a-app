import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/security';
import { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../DB/models/user.model';
import { asyncHandler } from '../utils/error/errorHandler';

export interface RequestWithUser extends Request {
    user: IUser;
}

export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    const [bearer, token] = authorization?.split(' ') as string[];

    let signature: string = '';

    switch (bearer) {
        case 'user':
            signature = process.env.USER_SIGNATURE!;
            break;

        case 'admin':
            signature = process.env.ADMIN_SIGNATURE!;
            break;
    }

    const payload = verifyToken(token, signature) as JwtPayload;

    if (payload.error) {
        let error = undefined;
        switch (payload.error.name) {
            case 'TokenExpiredError':
                error = new Error('token expired', { cause: 401 });
                return next(error);
            case 'JsonWebTokenError':
                error = new Error('invalid token', { cause: 401 });
                return next(error);
        }
    }

    const user = await User.findById(payload.id) as IUser | null;

    if (!user) {
        const error = new Error('user not found', { cause: 404 });
        return next(error);
    }

    (req as RequestWithUser).user = user;

    next();
});
