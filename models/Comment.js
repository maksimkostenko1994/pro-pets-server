const sequelize = require('../db/db')
const {DataTypes} = require('sequelize')

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    text: {type: DataTypes.TEXT, allowNull: false}
})

module.exports = Comment