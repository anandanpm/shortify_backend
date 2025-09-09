import { Router } from 'express';
import { UserController } from '../Controller/userController';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post ('/logout',UserController.logout);
router.post('/refresh-token',UserController.refreshToken);

export default router;