const express = require('express')
const WorkoutsService = require('./workouts-services')
const path = require('path')


const jsonParer = express.json()
const workoutsRouter = express.Router()

workoutsRouter
    .route("/")
    .get((req, res, next) => {
        const knexInstance = (req.app.get('db'))
        res.send("Workouts is working")
    })
    .post(jsonParer, (req, res, next) => {
        const { workoutname, userid } = req.body
        const newWorkout = {  workoutname, userid }

        if(!workoutname || !userid) {
            return res.status(400).json({ error: { message: `Missing name in workout` } })
        }

        WorkoutsService.createWorkout(
            req.app.get('db'),
            newWorkout
        )
        .then(workout => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl + `/${workout[0].workoutid}`))
                .json(workout)
        })
    });

workoutsRouter
    .route("/:workout_id")
    .get((req, res, next) => {
        const knexIntsance = req.app.get('db');
        WorkoutsService.getWorkoutById(
            knexIntsance,
            req.params.workout_id
        )
        .then(workout => {
            if(!workout) {
                return res
                .status(404)
                .json({
                    error: { message: `workout does not exist`}
                })
            }
            res.json(workout)
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        WorkoutsService.deleteWorkoutById(
            req.app.get('db'),
            req.params.workout_id
        )
        .then(() => {
            res.status(204).end()
        })
    })

workoutsRouter
    .route('/user/:user_id')
    .get((req, res, next) => {
        const knexIntsance = req.app.get('db')

        WorkoutsService.getWorkoutByUserId(
            knexIntsance,
            req.params.user_id
        )
        .then(workout => {
            if(!workout) {
                return res
                    .status(404)
                    .json({
                        error: { message: 'Cant find workouts'}
                    })
            }
            res.json(workout)
        })
        .catch(next)
    })

    module.exports = workoutsRouter