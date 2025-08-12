require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');

const User = require('./src/models/userModel');
const Event = require('./src/models/eventModel');
const Institution = require('./src/models/institutionModel');
const EventRegistration = require('./src/models/eventRegistrationModel');

User.hasMany(Event, { foreignKey: 'organizer_id' });
Event.belongsTo(User, { as: 'Organizer', foreignKey: 'organizer_id' });

Institution.hasMany(Event, { foreignKey: 'institution_id' });
Event.belongsTo(Institution, { foreignKey: 'institution_id' });

User.belongsToMany(Event, { through: EventRegistration, foreignKey: 'user_id', as: 'RegisteredEvents' });
Event.belongsToMany(User, { through: EventRegistration, foreignKey: 'event_id', as: 'RegisteredUsers' });

const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

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
        res.status(200).json({
            message: 'connection successful',
        });
    } catch (error) {
        res.status(500).json({
            message: 'error connecting to the database with Sequelize',
            error: error.message
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`node.js server started on port ${PORT}`);
            console.log(`access at: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to the database with Sequelize or sync models:', err);
        process.exit(1);
    });
