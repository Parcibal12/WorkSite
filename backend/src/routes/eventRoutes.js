import express from 'express';
import eventController from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.get('/', eventController.getAllEvents);

router.get('/:id', eventController.getEventById);

router.post('/', protect, eventController.createEvent);

router.put('/:id/register', protect, eventController.registerForEvent);


export default router;