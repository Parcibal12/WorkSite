import express from 'express';
import { createInstitution, getInstitutions } from '../controllers/institutionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createInstitution);


router.get('/', getInstitutions);

export default router;
