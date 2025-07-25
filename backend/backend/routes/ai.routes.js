import Router from 'express';
import * as AiController from '../controllers/ai.controller.js';

const router = Router();

router.get('/generate', AiController.generateContent);

export default router;
