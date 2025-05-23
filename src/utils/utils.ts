import { Response } from "express";
import jwt from "jsonwebtoken";
import { IToken } from "../interfaces/auth.interface";
import bcrypt from "bcryptjs";

export const generateToken = ({
  payload,
  res,
}: {
  payload: IToken;
  res: Response;
}) => {
  const { email, id } = payload;
  const token = jwt.sign({ email, id }, `${process.env.JWT_SECRET}`, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export const verifyToken = async ({ token }: { token: string }) => {
  const decoded = await jwt.verify(token, `${process.env.JWT_SECRET}`);
  return decoded;
};

export const generateHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hashSync(password, salt);
  return hashPassword;
};

export const compareHashedPassword = async (
  password: string,
  toComparePassword: string
) => {
  const isPasswordMatch = await bcrypt.compare(password, toComparePassword);
  return isPasswordMatch;
};
