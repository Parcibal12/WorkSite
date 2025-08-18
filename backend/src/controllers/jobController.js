import { Job } from '../models/jobModel.js';

export const getJobsController = async (req, res) => {
    try {
        const jobs = await Job.findAll();
        const formattedJobs = jobs.map(job => ({
            ...job.toJSON(),
            benefits_list: job.benefits_list ? JSON.parse(job.benefits_list) : []
        }));
        res.status(200).json(formattedJobs);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getJobByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findByPk(id);
        
        if (!job) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }
        
        const formattedJob = {
            ...job.toJSON(),
            benefits_list: job.benefits_list ? JSON.parse(job.benefits_list) : []
        };

        res.status(200).json(formattedJob);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const createJobController = async (req, res) => {
    try {
        const newJobData = req.body;
        const createdJob = await Job.create(newJobData);
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json(error);
    }
};