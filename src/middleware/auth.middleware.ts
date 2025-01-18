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

    if (!authorization) {
        const error = new Error('unauthorized access. token not found in header.', { cause: 401 });
        return next(error);
    }

    const [bearer, token] = authorization?.split(' ') as string[];

    if (!bearer || !token) {
        const error = new Error('invalid token or bearer.', { cause: 401 });
        return next(error);
    }

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

    const user = (await User.findById(payload.id)) as IUser | null;

    if (!user) {
        const error = new Error('user not found', { cause: 404 });
        return next(error);
    }

    (req as RequestWithUser).user = user.toObject();

    return next();
});

export const authorization = (accessRoles: string[]) => {
    return asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { role } = req.user;

        if (!accessRoles.includes(role)) {
            const error = new Error('unauthorized access', { cause: 403 });

            return next(error);
        }

        return next();
    });
};
