import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    institution_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    posted_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    application_deadline: {
        type: DataTypes.DATE,
        allowNull: true
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    benefits_list: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contractType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    workplace_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    employment_type: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'jobs',
    timestamps: true 
});

export { Job };