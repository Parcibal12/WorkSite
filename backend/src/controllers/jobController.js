import { Job } from '../models/jobModel.js';
import { SavedJob } from '../models/savedJobModel.js';

export const getJobsController = async (req, res) => {
    try {
        const jobs = await Job.findAll();
        const formattedJobs = jobs.map(job => ({
            ...job.toJSON(),
            benefits_list: job.benefits_list ? JSON.parse(job.benefits_list) : []
        }));
        res.json(formattedJobs);
    } catch (error) {
        res.status(500).end();
    }
};

export const getJobByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findByPk(id);
        const formattedJob = {
            ...job.toJSON(),
            benefits_list: job.benefits_list ? JSON.parse(job.benefits_list) : []
        };
        res.json(formattedJob);
    } catch (error) {
        res.status(500).end();
    }
};

export const createJobController = async (req, res) => {
    try {
        const newJobData = req.body;
        const createdJob = await Job.create(newJobData);
        res.json(createdJob);
    } catch (error) {
        res.status(500).end();
    }
};

export const updateJobController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const [rowsAffected, [updatedJob]] = await Job.update(updatedData, {
            where: { id: id },
            returning: true
        });
        res.json(updatedJob);
    } catch (error) {
        res.status(500).end();
    }
};

export const saveJobController = async (req, res) => {
    try {
        const userId = req.userId;
        const { jobId } = req.body;
        const [savedJob, created] = await SavedJob.findOrCreate({
            where: { userId, jobId },
            defaults: { userId, jobId }
        });
        res.json({ created });
    } catch (error) {
        res.status(500).end();
    }
};

export const unsaveJobController = async (req, res) => {
    try {
        const userId = req.userId;
        const { jobId } = req.body;
        await SavedJob.destroy({
            where: { userId, jobId }
        });
        res.end();
    } catch (error) {
        res.status(500).end();
    }
};

export const getSavedJobsController = async (req, res) => {
    try {
        const userId = req.userId;
        const savedJobIds = await SavedJob.findAll({
            where: { userId: userId },
            attributes: ['jobId']
        });
        const ids = savedJobIds.map(savedJob => savedJob.jobId);
        const jobs = await Job.findAll({
            where: {
                id: ids
            }
        });
        const formattedJobs = jobs.map(job => ({
            ...job.toJSON(),
            benefits_list: job.benefits_list ? JSON.parse(job.benefits_list) : []
        }));
        res.json(formattedJobs);
    } catch (error) {
        res.status(500).end();
    }
};