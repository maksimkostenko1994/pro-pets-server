const sequelize = require('../db/db')
const {DataTypes} = require('sequelize')

//foreign key = [user_id]
const Service = sequelize.define('service', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    location: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false},
    date: {type: DataTypes.STRING, allowNull: false},
    photo: {type: DataTypes.STRING, allowNull: false},
    contacts: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.TEXT, allowNull: false}
})

module.exports = Service