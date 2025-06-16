import mongoose, {Schema } from 'mongoose';
import { IUrl } from "../Interface/urlInterface";

const UrlSchema: Schema = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,

    },
    shortCode: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUrl>('Url', UrlSchema);