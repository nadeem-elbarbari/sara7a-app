import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/error/errorHandler";
import User from "../../DB/models/user.model";
import { IMessage, Message } from "../../DB/models/messages.model";

export const sendMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content, userId } = req.body;

    const isUser = await User.findById(userId).exec();

    if (!isUser) {
      const error = new Error("this user not exist", { cause: 400 });
      return next(error);
    }

    const data = await Message.create({ content, userId });

    res
      .status(201)
      .json({ status: "success", message: "message sent successfully", data });
  }
);

export const getMessages = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const messages = (await Message.find(
      { userId: req.user._id },
      { content: 1, createdAt: 1 }
    ).exec()) as IMessage[];

    function formatDateToDDMMYYYY(dateString: string): string {
      
      // Date components
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();
      
      // Time components
      let hours = date.getHours() as string | number;
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      // Determine AM or PM
      const ampm = (hours as number) >= 12 ? "PM" : "AM";
      hours = (hours as number) % 12; // Convert hours to 12-hour format
      hours = hours ? String(hours).padStart(2, "0") : "12"; // Adjust hour (0 becomes 12)

      return `${day}/${month}/${year} at ${hours}:${minutes}:${seconds} ${ampm}`;
    }

    const formattedMessages = messages.map((message) => ({
      content: message.content,
      createdAt: formatDateToDDMMYYYY(message.createdAt!), // Format createdAt
    }));

    if (!messages) {
      const error = new Error("messages not found", { cause: 404 });
      return next(error);
    }

    res
      .status(200)
      .json({
        status: "success",
        count: messages.length,
        data: formattedMessages,
      });
  }
);
