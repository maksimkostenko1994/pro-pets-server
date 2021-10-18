const User = require('./User')
const Post = require('./Post')
const Pet = require('./Pet')
const Service = require('./Service')
const Comment = require('./Comment')

User.hasMany(Post)
Post.belongsTo(User)

User.hasOne(Pet)
Pet.belongsTo(User)

User.hasMany(Service)
Service.belongsTo(User)

User.hasMany(Comment)
Comment.belongsTo(User)

Post.hasMany(Comment)
Comment.belongsTo(Post)