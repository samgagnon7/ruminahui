import express from 'express';
import imageController from '../controllers/imageController.js';

const router = express.Router();

// Define routes
router.post('/', imageController.postImage);

export { router as imageRoutes };