import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './userModel.js';
import { Job } from './jobModel.js';

const SavedJob = sequelize.define('SavedJob', {
    userId: {
        type: DataTypes.UUID,
        references: { model: User, key: 'id' },
        primaryKey: true
    },
    jobId: {
        type: DataTypes.INTEGER,
        references: { model: Job, key: 'id' },
        primaryKey: true
    }
}, {
    tableName: 'saved_jobs',
    timestamps: false
});

export { SavedJob };