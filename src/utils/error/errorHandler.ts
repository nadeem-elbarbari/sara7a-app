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

    let message: string = '';

    switch (error?.name) {
        case 'JsonWebTokenError':
            message = 'Invalid token';
            error['cause'] = 401;
            break;
        case 'TokenExpiredError':
            message = 'Token expired';
            error['cause'] = 401;
            break;
        default:
            message = error.message;
    }

    if ((error as IError).validationErrors) {
        return res
            .status(error['cause'] as number)
            .json({ status: 'failed', message: message, errors: (error as IError).validationErrors });
    }

    const errorResponse = {
        status: 'failed',
        message: message,
        stack: error.stack,
    };

    return res.status(error['cause'] as number || 500).json(errorResponse);
};
