import { Request, Response, NextFunction } from 'express';
import { IError } from '../../middleware/validations/validation';

export const asyncHandler = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export const globalErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = Number(error['cause']) || 500;

    let message: string = '';

    switch (error?.name) {
        case 'JsonWebTokenError':
            message = 'Invalid token';
            error['cause'] = 401;
            delete error.stack;
            break;
        case 'TokenExpiredError':
            message = 'Token expired';
            error['cause'] = 401;
            delete error.stack;
            break;
        default:
            message = error.message;
    }

    if ((error as IError).validationErrors) {
        return res.status(statusCode).json({ status: 'failed', message: message, errors: (error as IError).validationErrors });
    }

    const errorResponse = {
        status: 'failed',
        message: message,
        stack: error.stack,
    };

    return res.status(statusCode).json(errorResponse);
};
