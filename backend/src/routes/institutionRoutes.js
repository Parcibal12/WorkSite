import express from 'express';
import { createInstitution, getInstitutions } from '../controllers/institutionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createInstitution);


router.get('/', getInstitutions);

export default router;
