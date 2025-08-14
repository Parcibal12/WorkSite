import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Institution = sequelize.define('Institution', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
}, {
    tableName: 'institutions',
    timestamps: true,
});

export { Institution };
