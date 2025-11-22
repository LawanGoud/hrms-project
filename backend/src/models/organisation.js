'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Organisation extends Model {
        static associate(models) {
            Organisation.hasMany(models.User, { foreignKey: 'organisation_id' });
            Organisation.hasMany(models.Employee, { foreignKey: 'organisation_id' });
            Organisation.hasMany(models.Team, { foreignKey: 'organisation_id' });
            Organisation.hasMany(models.Log, { foreignKey: 'organisation_id' });
        }
    }
    Organisation.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Organisation',
        tableName: 'organisations',
        underscored: true,
    });
    return Organisation;
};
