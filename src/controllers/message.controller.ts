import { NextFunction, Request, Response } from "express";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { content, sender, receiver } = req.body;
    // const message = await MessageModel.create({
    //   content,
    //   sender,
    //   receiver,
    // });
  } catch (err) {
    next(err);
  }
};
