import { Request, Response, NextFunction } from 'express';

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
  return res.status((error['cause'] as number) || 500).json({
    status: 'failed',
    message: error.message,
    stack: error.stack,
  });
};
