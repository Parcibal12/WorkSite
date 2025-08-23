import express from 'express';
import eventController from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.get('/', eventController.getAllEvents);

router.get('/:id', eventController.getEventById);

router.post('/', authMiddleware, eventController.createEvent);

router.put('/:id/register', authMiddleware, eventController.registerForEvent);


export default router;