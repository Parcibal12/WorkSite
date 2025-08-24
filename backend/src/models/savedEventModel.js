import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './userModel.js';
import { Event } from './eventModel.js';

const SavedEvent = sequelize.define('SavedEvent', {
    userId: {
        type: DataTypes.UUID,
        references: { model: User, key: 'id' },
        primaryKey: true
    },
    eventId: {
        type: DataTypes.UUID,
        references: { model: Event, key: 'id' },
        primaryKey: true
    }   
}, {
    tableName: 'saved_events',
    timestamps: false
});

export { SavedEvent };
