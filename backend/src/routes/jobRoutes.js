import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getJobsController, getJobByIdController, createJobController, updateJobController, saveJobController, unsaveJobController, getSavedJobsController } from '../controllers/jobController.js';


const router = express.Router();

router.get('/saved', authMiddleware, getSavedJobsController);
router.post('/save', authMiddleware, saveJobController);
router.post('/unsave', authMiddleware, unsaveJobController);

router.get('/', getJobsController);
router.get('/:id', getJobByIdController);
router.post('/', createJobController);
router.put('/:id', updateJobController);


export default router;
