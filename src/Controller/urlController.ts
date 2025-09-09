import { Request, Response } from 'express'
import { nanoid } from 'nanoid'
import Url from '../Model/urlModel'
import { IUrl } from '../Interface/urlInterface'
import { AuthenticatedRequest } from '../Interface/authenticatedRequest'
import { HttpStatusCode } from '../Constant/statusCode'
import { ErrorMessages } from '../Constant/errorMessage'
import { SuccessMessages } from '../Constant/successMessage'
import { ApiResponse } from '../Types/apiResponse'

export class UrlController {
  static async shortenUrl(req: Request, res: Response): Promise<void> {
    try {
      const { originalUrl } = req.body as { originalUrl: string }
      const userId = (req as AuthenticatedRequest).user.userId

      const existingUrl = await Url.findOne({ originalUrl, userId })
      if (existingUrl) {
        const response: ApiResponse = {
          success: true,
          message: SuccessMessages.URL_ALREADY_EXISTS,
          data: {
            originalUrl: existingUrl.originalUrl,
            shortUrl: existingUrl.shortUrl,
            shortCode: existingUrl.shortCode,
            clickCount: existingUrl.clickCount, 
          },
        }
        res.status(HttpStatusCode.OK).json(response)
        return
      }

      let shortCode = nanoid(8)
      let existing = await Url.findOne({ shortCode })

      while (existing) {
        shortCode = nanoid(8)
        existing = await Url.findOne({ shortCode })
      }

      const baseUrl = process.env.BASE_URL
      const shortUrl = `${baseUrl}/${shortCode}`

      const url: IUrl = new Url({
        originalUrl,
        shortCode,
        shortUrl,
        userId,
        clickCount: 0, // ✅ initialize
      })

      await url.save()

      const response: ApiResponse = {
        success: true,
        message: SuccessMessages.URL_SHORTENED_SUCCESSFULLY,
        data: {
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          shortCode: url.shortCode,
          clickCount: url.clickCount, 
        },
      }

      res.status(HttpStatusCode.CREATED).json(response)
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR,
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response)
    }
  }

  static async getUserUrls(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.userId
      const urls = await Url.find({ userId }).sort({ createdAt: -1 })

      const response: ApiResponse = {
        success: true,
        message: SuccessMessages.URLS_RETRIEVED_SUCCESSFULLY,
        data: urls.map((url) => ({
          id: url._id,
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          shortCode: url.shortCode,
          clickCount: url.clickCount, 
          createdAt: url.createdAt,
        })),
      }

      res.status(HttpStatusCode.OK).json(response)
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR,
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response)
    }
  }

  static async redirectToOriginal(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params

      const url = await Url.findOne({ shortCode })

      if (!url) {
        const response: ApiResponse = {
          success: false,
          message: ErrorMessages.URL_NOT_FOUND,
        }
        res.status(HttpStatusCode.NOT_FOUND).json(response)
        return
      }

      // ✅ increment click count
      url.clickCount= (url.clickCount || 0) + 1
      await url.save()

      res.redirect(HttpStatusCode.MOVED_PERMANENTLY, url.originalUrl)
    } catch (error) {
      console.error("Redirect error:", error)
      const response: ApiResponse = {
        success: false,
        message: ErrorMessages.SERVER_ERROR,
      }
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response)
    }
  }
}
