'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        static associate(models) {
            Employee.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
            Employee.belongsToMany(models.Team, { through: models.EmployeeTeam, foreignKey: 'employee_id' });
        }
    }
    Employee.init({
        organisation_id: DataTypes.INTEGER,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Employee',
        tableName: 'employees',
        underscored: true,
    });
    return Employee;
};
