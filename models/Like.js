const sequelize = require('../db/db')
const {DataTypes} = require('sequelize')

const Like = sequelize.define('like', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true}
})

module.exports = Like