require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');

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

sequelize.sync()
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