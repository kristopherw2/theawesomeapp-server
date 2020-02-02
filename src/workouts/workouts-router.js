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

workoutsRouter
    .route('/user/:user_id')
    .get((req, res, next) => {
        const knexIntsance = req.app.get('db')
        console.log(req.params.user_id)

        WorkoutsService.getWorkoutByUserId(
            knexIntsance,
            req.params.user_id
        )
        .then(workout => {
            res.json(workout)
        })
        .catch(next)
    })

    module.exports = workoutsRouter