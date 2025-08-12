const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', eventController.getAllEvents);

router.get('/:id', eventController.getEventById);

router.post('/', authMiddleware, eventController.createEvent);

router.post('/:id/register', authMiddleware, eventController.registerForEvent);

module.exports = router;