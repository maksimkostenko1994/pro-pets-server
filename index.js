require('dotenv').config()
const express = require('express')

const path = require('path')

const sequelize = require('./db/db')
require('./models/models')

const cors = require('cors')
const fileUpload = require('express-fileupload')

const router = require('./routes/routes')

const errorHandler = require('./middleware/ErrorHandlerMiddleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

//to the end
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (error) {
        console.log(error.message)
    }
}

start().then()