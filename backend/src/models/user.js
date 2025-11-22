'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Organisation, { foreignKey: 'organisation_id' });
            User.hasMany(models.Log, { foreignKey: 'user_id' });
        }
    }
    User.init({
        organisation_id: DataTypes.INTEGER,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
    });
    return User;
};
