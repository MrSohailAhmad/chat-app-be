import { Response } from "express";
import jwt from "jsonwebtoken";
import { IToken } from "../interfaces/auth.interface";

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
