const { Op } = require('sequelize');
const Event = require('../models/eventModel');
const Institution = require('../models/institutionModel');
const User = require('../models/userModel');
const EventRegistration = require('../models/eventRegistrationModel');

const eventController = {
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.findAll({
                include: [
                    {
                        model: Institution,
                        attributes: ['name'],
                    },
                    {
                        model: User,
                        as: 'Organizer',
                        attributes: ['id', 'username', 'email'],
                    },
                    {
                        model: User,
                        as: 'RegisteredUsers',
                        attributes: ['id'],
                        through: { attributes: [] }
                    }
                ],
            });

            const eventsWithCount = events.map(event => ({
                id: event.id,
                title: event.title,
                description: event.description,
                location: event.location,
                date: event.date,
                organizer: event.Organizer,
                institution_name: event.Institution ? event.Institution.name : null,
                registered_count: event.RegisteredUsers.length,
            }));

            res.status(200).json({
                message: 'Events fetched successfully',
                data: eventsWithCount
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error while fetching events.',
                error: error.message
            });
        }
    },

    getEventById: async (req, res) => {
        const { id } = req.params;
        try {
            const event = await Event.findByPk(id, {
                include: [
                    {
                        model: Institution,
                        attributes: ['name'],
                    },
                    {
                        model: User,
                        as: 'Organizer',
                        attributes: ['id', 'username', 'email'],
                    },
                    {
                        model: User,
                        as: 'RegisteredUsers',
                        attributes: ['id'],
                        through: { attributes: [] }
                    }
                ],
            });

            if (!event) {
                return res.status(404).json({ message: 'Event not found.' });
            }

            const eventWithCount = {
                id: event.id,
                title: event.title,
                description: event.description,
                location: event.location,
                date: event.date,
                organizer: event.Organizer,
                institution_name: event.Institution ? event.Institution.name : null,
                registered_count: event.RegisteredUsers.length,
            };

            res.status(200).json({
                message: 'Event fetched successfully',
                data: eventWithCount
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error while fetching event.',
                error: error.message
            });
        }
    },

    createEvent: async (req, res) => {
        const organizer_id = req.user.id;
        let { title, description, location, date, institution_id } = req.body;

        if (!title || !description || !location || !date) {
            return res.status(400).json({ message: 'All required fields are: title, description, location, and date' });
        }

        if (institution_id === "") {
            institution_id = null;
        }

        try {
            if (institution_id) {
                const institution = await Institution.findByPk(institution_id);
                if (!institution) {
                    return res.status(404).json({ message: 'Institution not found.' });
                }
            }
            
            const newEvent = await Event.create({
                organizer_id,
                institution_id,
                title,
                description,
                location,
                date
            });

            res.status(201).json({
                message: 'Event created successfully',
                data: newEvent
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                return res.status(400).json({ message: 'Validation error: ' + errors.join(', ') });
            }
            res.status(500).json({
                message: 'Internal server error while creating event',
                error: error.message
            });
        }
    },

    registerForEvent: async (req, res) => {
        const { id: event_id } = req.params;
        const user_id = req.user.id;

        try {
            const event = await Event.findByPk(event_id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found.' });
            }

            const [registration, created] = await EventRegistration.findOrCreate({
                where: { user_id, event_id },
                defaults: { user_id, event_id },
            });

            if (!created) {
                return res.status(409).json({ message: 'User is already registered for this event.' });
            }

            res.status(201).json({
                message: 'Successfully registered for the event'
            });

        } catch (error) {
            res.status(500).json({
                message: 'Internal server error while registering for event',
                error: error.message
            });
        }
    }
};

module.exports = eventController;