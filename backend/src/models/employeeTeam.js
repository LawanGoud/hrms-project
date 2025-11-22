'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EmployeeTeam extends Model {
        static associate(models) {
            // Associations are defined in Employee and Team models
        }
    }
    EmployeeTeam.init({
        employee_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        team_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'teams',
                key: 'id'
            }
        },
        assigned_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'EmployeeTeam',
        tableName: 'employee_teams',
        underscored: true,
        timestamps: false // We use assigned_at manually or we can enable timestamps but the schema said assigned_at
    });
    return EmployeeTeam;
};
