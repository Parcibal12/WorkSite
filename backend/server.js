import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './src/config/database.js';

import { User } from './src/models/userModel.js';
import { Event } from './src/models/eventModel.js';
import { Institution } from './src/models/institutionModel.js';
import { EventRegistration } from './src/models/eventRegistrationModel.js';

Event.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });
User.hasMany(Event, { foreignKey: 'organizer_id', as: 'organizedEvents' });

Event.belongsTo(Institution, { foreignKey: 'institution_id', as: 'institution' });
Institution.hasMany(Event, { foreignKey: 'institution_id', as: 'events' });

Event.belongsToMany(User, {
    through: EventRegistration,
    foreignKey: 'event_id',
    as: 'registeredUsers'
});
User.belongsToMany(Event, {
    through: EventRegistration,
    foreignKey: 'user_id',
    as: 'registeredEvents'
});

import authRoutes from './src/routes/authRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import institutionRoutes from './src/routes/institutionRoutes.js';

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
