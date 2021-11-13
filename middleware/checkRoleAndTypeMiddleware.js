const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const {type} = req.body
        console.log(type)
        if (!token) return res.status(401).json({message: 'Not authorized'})
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (decoded.role !== 'ADMIN' && (type === 'VetHelp' || type === 'Hotels'))
            return res.status(403).json({message: 'No access'})
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({message: 'Not authorized'})
    }
}