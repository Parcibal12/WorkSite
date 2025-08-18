import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    company_logo: {
        type: DataTypes.STRING,
        allowNull: true
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
    },
    employer_logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    employer_location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    employer_description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'jobs'
});

export { Job };