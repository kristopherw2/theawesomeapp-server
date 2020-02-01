const express = require('express')
const WorkoutsService = require('./workouts-services')


const jsonParer = express.json()
const workoutsRouter = express.Router()

workoutsRouter
    .route("/")
    .get((req, res, next) => {
        const knexIntsance = (req.app.get('db'))
        res.send("Workouts is working")
    })

    module.exports = workoutsRouter