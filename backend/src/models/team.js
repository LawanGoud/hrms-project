'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Team extends Model {
        static associate(models) {
            Team.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
            Team.belongsToMany(models.Employee, { through: models.EmployeeTeam, foreignKey: 'team_id' });
        }
    }
    Team.init({
        organisation_id: DataTypes.INTEGER,
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Team',
        tableName: 'teams',
        underscored: true,
    });
    return Team;
};
