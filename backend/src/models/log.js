'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Log extends Model {
        static associate(models) {
            Log.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
            Log.belongsTo(models.User, { foreignKey: 'user_id' });
        }
    }
    Log.init({
        organisation_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        action: DataTypes.STRING,
        meta: DataTypes.JSONB,
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Log',
        tableName: 'logs',
        underscored: true,
        timestamps: false // Using custom timestamp field
    });
    return Log;
};
