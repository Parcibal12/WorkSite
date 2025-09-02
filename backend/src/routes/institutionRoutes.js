import express from 'express';
import { createInstitution, getInstitutions } from '../controllers/institutionController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateInstitution } from '../controllers/institutionController.js';

const router = express.Router();

router.post('/', authMiddleware, createInstitution);


router.get('/', getInstitutions);
router.put('/:id', authMiddleware, updateInstitution); 

export default router;
