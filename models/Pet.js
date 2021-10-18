const sequelize = require('../db/db')
const {DataTypes} = require('sequelize')

//foreign key = [user_id]
const Pet = sequelize.define('pet', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    sex: {type: DataTypes.STRING, allowNull: false},
    breed: {type: DataTypes.STRING, allowNull: false},
    color: {type: DataTypes.STRING, allowNull: false},
    height: {type: DataTypes.STRING, allowNull: false},
    features: {type: DataTypes.TEXT, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    location: {type: DataTypes.STRING, allowNull: false},
    status: {type: DataTypes.STRING, defaultValue: 'none'}
})

module.exports = Pet