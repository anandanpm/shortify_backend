import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  cookies: any;
  user: {
    userId: string;
    email: string;
  };
}