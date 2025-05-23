import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/auth.model";
import { sendResponse } from "../utils/sendResponse";
import {
  compareHashedPassword,
  generateHashedPassword,
  generateToken,
} from "../utils/utils";
import cloudinary from "../lib/cloudinary";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, password } = req.body;

  try {
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

    const hashPassword = await generateHashedPassword(password);

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

      await user.save();
    }

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
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
      const isPasswordMatch = await compareHashedPassword(
        password,
        user.password
      );

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

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("jwt");

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?._id;
    const { profilePic } = req.body;
    const { password, ...rest } = req.body;
    const user: any = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User Not Found");
    }

    const updatableFields = { ...rest };
    // Dynamically assign fields
    Object.entries(updatableFields).forEach(([key, value]) => {
      if (value !== undefined) {
        user[key] = value;
      }
    });

    let hashPassword;
    if (password) {
      hashPassword = await generateHashedPassword(password);
      user.password = hashPassword;
    }
    await user.save();

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User update successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfilePIcture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { profilePic } = req.body;
    const userId = req?.user?._id;

    if (!profilePic) {
      throw new Error("Profile picture is required");
    }

    const picResponse = await cloudinary.uploader.upload(profilePic);

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePic: picResponse.secure_url,
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Login successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not Active");
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Active",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
