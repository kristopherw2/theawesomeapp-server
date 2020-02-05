const express = require('express')
const path = require('path')
const ExercisesService = require('./exercises-service')

const exercisesRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');


exercisesRouter
  .route('/:workoutid')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ExercisesService.pullExercises(knexInstance, req.params.workoutid)
      .then(exercises => {
        if (!exercises) {
          return res.status(404).json({
            error: { message: "workout doesnt exist" }
          });
        }
        res.json(exercises);

      }
      )
      .catch(next)
  });

exercisesRouter
  .route('/create')
  .post(jsonParser, (req, res, next) => {
    const { exercisename, sets, repetitions, weight, time, caloriesburned, workoutid } = req.body
    const newExercise = { exercisename, sets, repetitions, weight, time, caloriesburned, workoutid }

    for (const [key, value] of Object.entries(newExercise)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        })
      }
    }


    ExercisesService.addNewExercise(
      req.app.get('db'),
      newExercise
    )
      .then(newExercise => {
        res.status(201)
          .location(path.posix.join(req.originalUrl + `/${newExercise[0].workoutid}`))
          .json(newExercise)
      })
      .catch(next)
  });

exercisesRouter
  .route('/:exerciseid')
    .all((req, res, next) => {
      ExercisesService.deleteExercise(
      req.app.get('db'),
      req.params.exerciseid
  )
    .then(exercises => {
      if (!exercises) {
        return res.status(404).json({
          error: { message: `Exercise ID doesn't exist` }
        })
    }
       res.exercises = exercises // save the exercise for the next middleware
      next()
    })
    .catch(next)
})
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db')
    ExercisesService.deleteExercise(knexInstance, req.params.exerciseid)
      .then(deleteExercise => {
        res.send('Exercise Deleted').status(204).end()
      })
      .catch(next)
  });

module.exports = exercisesRouter
