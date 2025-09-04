import { Job } from '../models/jobModel.js';
import { SavedJob } from '../models/savedJobModel.js';
import { Institution } from '../models/institutionModel.js';
import { User } from '../models/userModel.js';

const formatJob = (job) => {
    if (!job) return null;

    const jobData = job.toJSON();
    const employer = jobData.employer || {};
    let benefits = [];

    if (jobData.benefits_list) {
        try {
            benefits = JSON.parse(jobData.benefits_list);
        } catch (e) {
            benefits = [];
        }
    }

    return {
        ...jobData,
        company_name: employer.name || null,
        company_logo: employer.logo_url || null,
        employer_description: employer.description || null,
        employer_location: employer.address || null,
        benefits_list: benefits
    };
};

export const getJobsController = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            include: [{
                model: Institution,
                as: 'employer',
                attributes: ['name', 'logo_url', 'description', 'address']
            }]
        });
        const formattedJobs = jobs.map(formatJob);
        res.json(formattedJobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getJobByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findByPk(id, {
            include: [{ model: Institution, as: 'employer' }]
        });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(formatJob(job));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createJobController = async (req, res) => {
    try {
        const { institution_id, title, description, benefits_list, ...otherData } = req.body;
        if (!institution_id || !title || !description) {
            return res.status(400).json({ error: 'institution_id, title, and description are required' });
        }
        const institution = await Institution.findByPk(institution_id);
        if (!institution) {
            return res.status(404).json({ error: 'Institution not found' });
        }
        
        const newJob = await Job.create({
            ...otherData,
            institution_id,
            title,
            description,
            benefits_list: benefits_list || "[]",
        });
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateJobController = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Job.update(req.body, { where: { id } });
        if (!updated) {
            return res.status(404).json({ error: 'Job not found or no changes made..' });
        }
        const updatedJob = await Job.findByPk(id);
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const saveJobController = async (req, res) => {
    try {
        const userId = req.userId;
        const { jobId } = req.body;
        await SavedJob.findOrCreate({ where: { userId, jobId } });
        res.status(201).json({ message: 'job saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const unsaveJobController = async (req, res) => {
    try {
        const userId = req.userId;
        const { jobId } = req.body;
        const deleted = await SavedJob.destroy({ where: { userId, jobId } });
        if (!deleted) {
            return res.status(404).json({ error: 'Saved job not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSavedJobsController = async (req, res) => {
    try {
        const userId = req.userId;
        const userWithJobs = await User.findByPk(userId, {
            include: [{
                model: Job,
                as: 'savedJobs',
                through: { attributes: [] },
                include: [{
                    model: Institution,
                    as: 'employer',
                    attributes: ['name', 'logo_url', 'description', 'address']
                }]
            }]
        });

        if (!userWithJobs || !userWithJobs.savedJobs) {
            return res.json([]);
        }

        const formattedJobs = userWithJobs.savedJobs.map(formatJob);
        res.json(formattedJobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};