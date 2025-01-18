import { NextFunction, Response } from "express";
import { RequestWithUser } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/error/errorHandler";

const getProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;

    return res.status(200).json({ status: 'success', data: user });
});
