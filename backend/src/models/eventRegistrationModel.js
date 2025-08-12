const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const Event = require('./eventModel');

const EventRegistration = sequelize.define('EventRegistration', {
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id',
        },
        primaryKey: true,
    },
    event_id: {
        type: DataTypes.UUID,
        references: {
            model: Event,
            key: 'id',
        },
        primaryKey: true,
    },
}, {
    tableName: 'event_registrations',
    timestamps: true,
});

module.exports = EventRegistration;