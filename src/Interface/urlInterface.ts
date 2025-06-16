import { Document} from 'mongoose';

export interface IUrl extends Document {
  _id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  userId: string;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}