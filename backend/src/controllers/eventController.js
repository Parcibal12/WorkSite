import { Event } from '../models/eventModel.js';
import { Institution } from '../models/institutionModel.js';
import { User } from '../models/userModel.js';
import { EventRegistration } from '../models/eventRegistrationModel.js';
import { SavedEvent } from '../models/savedEventModel.js';

const eventController = {
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.findAll({
                include: [
                    {
                        model: Institution,
                        as: 'institution', 
                        attributes: ['name', 'logo_url'],
                    },
                    {
                        model: User,
                        as: 'organizer', 
                        attributes: ['id', 'username', 'email'],
                    },
                    {
                        model: User,
                        as: 'registeredUsers', 
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
                organizer: event.organizer, 
                institution_name: event.institution ? event.institution.name : null,
                institution_logo: event.institution ? event.institution.logo_url : null,
                registered_count: event.registeredUsers.length,
            }));

            res.status(200).json(eventsWithCount);
        } catch (error) {
            console.error('Error in getAllEvents:', error);
            res.status(500).json({
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
                        as: 'institution',
                        attributes: ['name', 'logo_url'],
                    },
                    {
                        model: User,
                        as: 'organizer', 
                        attributes: ['id', 'username', 'email'],
                    },
                    {
                        model: User,
                        as: 'registeredUsers',
                        attributes: ['id'],
                        through: { attributes: [] }
                    }
                ],
            });

            if (!event) {
                return res.status(404).json({ error: 'event not found.' });
            }

            const eventWithCount = {
                id: event.id,
                title: event.title,
                description: event.description,
                location: event.location,
                date: event.date,
                organizer: event.organizer, 
                institution_name: event.institution ? event.institution.name : null,
                institution_logo: event.institution ? event.institution.logo_url : null,
                registered_count: event.registeredUsers.length,
            };

            res.status(200).json(eventWithCount);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    createEvent: async (req, res) => {
        const organizer_id = req.userId;
        let { title, description, location, date, institution_id } = req.body;

        if (!title || !description || !location || !date) {
            return res.status(400).json({ error: 'All required fields are: title, description, location, and date' });
        }

        if (institution_id) {
            try {
                const institution = await Institution.findByPk(institution_id);
                if (!institution) {
                    return res.status(404).json({ error: 'institution not found.' });
                }
            } catch (error) {
                return res.status(400).json({ error: 'Invalid institution ID provided.' });
            }
        }
        
        try {
            const newEvent = await Event.create({
                organizer_id,
                institution_id: institution_id || null, 
                title,
                description,
                location,
                date
            });

            res.status(201).json(newEvent);
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errors = error.errors.map(err => err.message);
                return res.status(400).json({ error: 'Validation error: ' + errors.join(', ') });
            }
            res.status(500).json({
                error: error.message
            });
        }
    },
    
    updateEvent: async (req, res) => {
        const { id } = req.params;
        const organizer_id = req.userId;
        const eventData = req.body;

        try {
            const event = await Event.findByPk(id);

            if (!event) {
                return res.status(404).json({ error: 'event not found' });
            }

            if (event.organizer_id !== organizer_id) {
                return res.status(403).json({ error: 'You are not authorized to update this event' });
            }

            if (eventData.institution_id) {
                const institution = await Institution.findByPk(eventData.institution_id);
                if (!institution) {
                    return res.status(404).json({ error: 'institution not found' });
                }
            }

            await event.update(eventData);

            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    deleteEvent: async (req, res) => {
        const { id } = req.params;
        const organizer_id = req.userId;

        try {
            const event = await Event.findByPk(id);

            if (!event) {
                return res.status(404).json({ error: 'event not found' });
            }

            if (event.organizer_id !== organizer_id) {
                return res.status(403).json({ error: 'You are not authorized to delete this event' });
            }

            await event.destroy();

            res.status(200).end();
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    registerForEvent: async (req, res) => {
        const { id: event_id } = req.params;
        const user_id = req.userId;

        try {
            const event = await Event.findByPk(event_id);
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            const [registration, created] = await EventRegistration.findOrCreate({
                where: { user_id, event_id },
                defaults: { user_id, event_id },
            });

            if (!created) {
                return res.status(409).json({ error: 'User is already registered for this event' });
            }

            res.status(201).end();

        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    saveEvent: async (req, res) => {
        try {
            const userId = req.userId;
            const { eventId } = req.body;
            await SavedEvent.findOrCreate({
                where: { userId, eventId }
            });
            res.status(201).json({ message: 'Event saved successfully' });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    unsaveEvent: async (req, res) => {
        try {
            const userId = req.userId;
            const { eventId } = req.body;
            await SavedEvent.destroy({
                where: { userId, eventId }
            });
            res.status(200).json({ message: 'Event unsaved successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to unsave event' });
        }
    },


    getSavedEvents: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findByPk(userId, {
                include: [{
                    model: Event,
                    as: 'savedEvents',
                    through: { attributes: [] },
                    include: [
                        {
                            model: Institution,
                            as: 'institution',
                            attributes: ['name', 'logo_url']
                        },
                        {
                            model: User,
                            as: 'registeredUsers',
                            attributes: ['id'],
                            through: { attributes: [] }
                        }
                    ]
                }]
            });

            if (!user) {
                return res.status(200).json([]);
            }

            const formattedEvents = user.savedEvents.map(event => ({
                id: event.id,
                title: event.title,
                description: event.description,
                location: event.location,
                date: event.date,
                institution_name: event.institution ? event.institution.name : 'Organizer',
                institution_logo: event.institution ? event.institution.logo_url : null,
                registered_count: event.registeredUsers ? event.registeredUsers.length : 0,
            }));

            res.status(200).json(formattedEvents);
        } catch (error) {
            console.error('Error in getSavedEvents:', error);
            res.status(500).json({ error: 'Failed to retrieve saved events' });
        }
    },






};

export default eventController;