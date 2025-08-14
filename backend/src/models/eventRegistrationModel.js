// src/models/eventRegistrationModel.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventRegistration = sequelize.define('EventRegistration', {
    user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    event_id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
}, {
    tableName: 'event_registrations',
    timestamps: false,
});

export { EventRegistration };
