import express from 'express';
import { getJobsController, getJobByIdController, createJobController } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobsController);
router.get('/:id', getJobByIdController);
router.post('/', createJobController);

export default router;
