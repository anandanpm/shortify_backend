
import { CorsOptions } from 'cors';

const allowedOrigin = process.env.FRONTEND_URL;

if (!allowedOrigin) {
  console.warn('⚠️ FRONTEND_URL is not defined in environment variables');
}

export const corsOptions: CorsOptions = {
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};