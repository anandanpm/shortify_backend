import mongoose, { Schema } from 'mongoose'
import { IUrl } from "../Interface/urlInterface"

const UrlSchema: Schema = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clickCount: {
      type: Number,
      default: 0, 
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IUrl>('Url', UrlSchema)
