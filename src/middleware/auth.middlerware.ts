import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/auth.interface";
import { UserModel } from "../models/auth.model";
import { verifyToken } from "./../utils/utils";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser | undefined; // or whatever your Mongoose user type is
  }
}

export const protectedRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new Error("Unauthorized : Token Not Provided");
    }

    const decoded: any = await verifyToken({ token });
    if (!decoded) {
      throw new Error("Unauthorized : Invalid Token");
    }

    const user = await UserModel.findById(decoded.id)
      .select("-password")
      .lean<IUser>();

    if (!user) {
      throw new Error("Unauthorized : Invalid Token or User");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
