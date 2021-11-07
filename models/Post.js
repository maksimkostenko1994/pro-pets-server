const sequelize = require('../db/db')
const {DataTypes} = require('sequelize')

//foreign keys = [user_id, pet_id]
const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    title: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.TEXT, allowNull: false},
    photo: {type: DataTypes.STRING, allowNull: false}
})

module.exports = Post