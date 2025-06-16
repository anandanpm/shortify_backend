
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import Url from '../Model/urlModel';
import { IUrl } from '../Interface/urlInterface';
import { AuthenticatedRequest } from '../Interface/authenticatedRequest';
import { HttpStatusCode } from '../Constant/statusCode';
import { ErrorMessages } from '../Constant/errorMessage';
import { SuccessMessages } from '../Constant/successMessage';
import { ApiResponse } from '../Types/apiResponse';
export class UrlController {
  static async shortenUrl(req: Request, res: Response): Promise<void> {
    try {
      const { originalUrl } = (req.body as unknown as { originalUrl: string });
      const userId = (req as AuthenticatedRequest).user.userId;

      const existingUrl = await Url.findOne({ originalUrl, userId });
      if (existingUrl) {
        const response: ApiResponse = {
          success: true,
          message: SuccessMessages.URL_ALREADY_EXISTS,
          data: {
            originalUrl: existingUrl.originalUrl,
            shortUrl: existingUrl.shortUrl,
            shortCode: existingUrl.shortCode
          }
        };
        res.status(HttpStatusCode.OK).json(response);
        return;
      }

      let shortCode = nanoid(8);
      let existing = await Url.findOne({ shortCode });

      while (existing) {
        shortCode = nanoid(8);
        existing = await Url.findOne({ shortCode });
      }

      const baseUrl = process.env.BASE_URL;
      const shortUrl = `${baseUrl}/${shortCode}`;

      const url: IUrl = new Url({
        originalUrl,
        shortCode,
        shortUrl,
        userId
      });

      await url.save();

      const response: ApiResponse = {
        success: true,
        message: SuccessMessages.URL_SHORTENED_SUCCESSFULLY,
        data: {
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          shortCode: url.shortCode
        }
      };

      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR
      };
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  static async getUserUrls(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.userId;
      const urls = await Url.find({ userId }).sort({ createdAt: -1 });

      const response: ApiResponse = {
        success: true,
        message: SuccessMessages.URLS_RETRIEVED_SUCCESSFULLY,
        data: urls.map(url => ({
          id: url._id,
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          shortCode: url.shortCode,
          createdAt: url.createdAt
        }))
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR
      };
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  static async redirectToOriginal(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;

      console.log(`Attempting to redirect shortCode: ${shortCode}`);

      const url = await Url.findOne({ shortCode });

      if (!url) {
        console.log(`URL not found for shortCode: ${shortCode}`);
        const response: ApiResponse = {
          success: false,
          message: ErrorMessages.URL_NOT_FOUND
        };
        res.status(HttpStatusCode.NOT_FOUND).json(response);
        return;
      }

      console.log(`Redirecting to: ${url.originalUrl}`);

      // Use 301 for permanent redirect (better for SEO)
      res.redirect(HttpStatusCode.MOVED_PERMANENTLY, url.originalUrl);
    } catch (error) {
      console.error("Redirect error:", error);
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR
      };
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }
}
