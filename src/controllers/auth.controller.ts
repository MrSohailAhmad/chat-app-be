import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/auth.model";
import { sendResponse } from "../utils/sendResponse";
import { generateToken } from "../utils/userToken";
import mongoose from "mongoose";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  const { email, name, password } = req.body;

  try {
    session.startTransaction();
    if (!email || !name || !password) {
      throw new Error("user fields are missing!");
    }

    if (password.length < 6) {
      throw new Error("Password must be 6 character long!");
    }

    const isExist = await UserModel.findOne({ email });

    if (isExist) {
      throw new Error(`Email already associated with another user`);
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hashSync(password, salt);

    const user: any = new UserModel({
      email,
      name,
      password: hashPassword,
    });

    if (user) {
      generateToken({
        payload: { id: user._id, email: email },
        res,
      });

      await user.save({ session });
    }
    await session.commitTransaction();
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    await session.abortTransaction();
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user?.password);

      if (!isPasswordMatch) {
        throw new Error("Invalid Credentials");
      }
      const { password: _, ...userWithoutPassword } = user;

      generateToken({
        payload: {
          id: userWithoutPassword._id.toString(),
          email: userWithoutPassword.email,
        },
        res,
      });
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User Login successfully",
        data: userWithoutPassword,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = () => {};

export const update = () => {};
