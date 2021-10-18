const sequelize = require('../db/db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING},
    avatar: {type: DataTypes.STRING, defaultValue: ''},
    user_pet: {type: DataTypes.STRING},
    nick: {type: DataTypes.STRING},
    pet_photo: {type: DataTypes.STRING},
    full_name: {type: DataTypes.STRING, defaultValue: 'John Wick'},
    role: {type: DataTypes.STRING, defaultValue: 'USER'}
})

module.exports = User