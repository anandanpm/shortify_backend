import { Document} from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}


