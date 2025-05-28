import { UserModel } from "../models/auth.model";
import { MessageModel } from "../models/message.model";

import cloudinary from "../lib/cloudinary";

import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { io, getReceiverSocketID } from "../lib/socket";
export const getUserForSidebar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req?.user?._id;

    const filteredUsers = await UserModel.find({
      id: { $ne: loggedInUser },
    }).select("-password");

    return sendResponse(res, {
      success: true,
      message: "Users fetched successfully",
      data: filteredUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { id: userToChatId } = req.params;

    const messages = await MessageModel.find({
      $or: [
        {
          sender: userId,
          receiver: userToChatId,
        },
        {
          sender: userToChatId,
          receiver: userId,
        },
      ],
    });
    return sendResponse(res, {
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;
    const { text, image } = req.body;

    let imageUrl = null;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        resource_type: "auto",
      });

      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await MessageModel.create({
      sender: senderId,
      receiver: receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // TODO: implement socket.io to send message to the receiver
    const receiverSocketId = getReceiverSocketID(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return sendResponse(res, {
      success: true,
      message: "Messages sent successfully",
      data: newMessage,
    });
  } catch (err) {
    next(err);
  }
};
