const express = require('express')
const cors = require('cors')
const serverless = require('serverless-http')
const usersRoutes = require('../routes/users')
const workoutsRoutes = require('../routes/workouts')
require('dotenv').config()
const port = process.env.PORT || 8000
const mongoose = require('mongoose')
const uri = `mongodb+srv://Dandan:${process.env.MONGODB_PASSWORD}@workouts.iw0b9.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
const app = express()

app.use('/.netlify/functions/api/users', usersRoutes)
app.use('/.netlify/functions/api/workouts', workoutsRoutes)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.listen(port, () => {
	console.log(`listening on port ${port}`)
})

module.exports.handler = serverless(app)