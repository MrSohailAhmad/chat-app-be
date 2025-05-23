import { ObjectId } from "mongoose";

export interface IUser {
  _id?: ObjectId; // optional if you don't need it explicitly
  email: string;
  name: string;
  password?: string;
  profilePic?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IToken {
  id: string;
  email: string;
}
