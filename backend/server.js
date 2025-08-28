import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './src/config/database.js';

import { User } from './src/models/userModel.js';
import { Event } from './src/models/eventModel.js';
import { Institution } from './src/models/institutionModel.js';
import { EventRegistration } from './src/models/eventRegistrationModel.js';
import { Job } from './src/models/jobModel.js';
import { SavedJob } from './src/models/savedJobModel.js'; 
import { SavedEvent } from './src/models/savedEventModel.js';
import { LikedEvent } from './src/models/likedEventModel.js';

import authMiddleware from './src/middleware/authMiddleware.js';


Event.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });
User.hasMany(Event, { foreignKey: 'organizer_id', as: 'organizedEvents' });

Event.belongsTo(Institution, { foreignKey: 'institution_id', as: 'institution' });
Institution.hasMany(Event, { foreignKey: 'institution_id', as: 'events' });

Event.belongsToMany(User, { through: EventRegistration, foreignKey: 'event_id', as: 'registeredUsers' });
User.belongsToMany(Event, { through: EventRegistration, foreignKey: 'user_id', as: 'registeredEvents' });

User.belongsToMany(Job, { through: SavedJob, foreignKey: 'userId', as: 'savedJobs' });
Job.belongsToMany(User, { through: SavedJob, foreignKey: 'jobId', as: 'savingUsers' });

User.belongsToMany(Event, {
    through: SavedEvent,
    foreignKey: 'userId',
    as: 'savedEvents'
});
Event.belongsToMany(User, {
    through: SavedEvent,
    foreignKey: 'eventId',
    as: 'eventSavingUsers'
});




import authRoutes from './src/routes/authRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import institutionRoutes from './src/routes/institutionRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('backend');
});

app.get('/test-db', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).end();
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/jobs', jobRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor de backend ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
        process.exit(1);
    });