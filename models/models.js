const User = require('./User')
const Post = require('./Post')
const Pet = require('./Pet')
const Service = require('./Service')
const Comment = require('./Comment')
const Like = require('./Like')

User.hasMany(Post)
Post.belongsTo(User)

User.hasOne(Pet)
Pet.belongsTo(User)

User.hasMany(Service)
Service.belongsTo(User)

User.hasMany(Comment)
Comment.belongsTo(User)

User.hasMany(Like)
Like.belongsTo(User)

Post.hasMany(Comment)
Comment.belongsTo(Post)

Post.hasMany(Like)
Like.belongsTo(Post)

