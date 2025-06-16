import { Router } from 'express';
import { UrlController } from '../Controller/urlController';
import { authMiddleware } from '../Middleware/authMiddleware';

const router = Router();

// Protected routes
router.post('/shorten', authMiddleware, UrlController.shortenUrl);
router.get('/my-urls', authMiddleware, UrlController.getUserUrls);

export default router;