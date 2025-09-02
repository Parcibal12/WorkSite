import { Institution } from '../models/institutionModel.js';

export const createInstitution = async (req, res) => {
    try {
        const { name, description, logo_url, address, contact_email, website } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "The 'name' and 'description' fields are required" });
        }

        const newInstitution = await Institution.create({
            name,
            description,
            logo_url,
            address,
            contact_email,
            website
        });

        res.status(201).json(newInstitution);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export const getInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.findAll();
        res.status(200).json(institutions);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export const getInstitutionById = async (req, res) => {
    try {
        const { id } = req.params;
        const institution = await Institution.findByPk(id);

        if (!institution) {
            return res.status(404).end();
        }

        res.status(200).json(institution);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export const updateInstitution = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRowsCount, updatedRows] = await Institution.update(req.body, {
            where: { id },
            returning: true,
        });

        if (updatedRowsCount === 0) {
            return res.status(404).end();
        }

        res.status(200).json(updatedRows[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export const deleteInstitution = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRowsCount = await Institution.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            return res.status(404).end();
        }

        res.status(200).end();
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
