const express = require("express");
const WorkoutsService = require("./workouts-services");
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");

const jsonParser = express.json();
const workoutsRouter = express.Router();

workoutsRouter
    .route("/")
    .all(requireAuth)
    .get((req, res, next) => {
        req.app.get("db");
        res.send("Workouts is working");
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { workoutname } = req.body;
        const newWorkout = { workoutname };

        for (const [key, value] of Object.entries(newWorkout)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                });
            }
        }
        newWorkout.userid = req.user.id;

        WorkoutsService.createWorkout(req.app.get("db"), newWorkout).then(
            workout => {
                res.status(201)
                    .location(
                        path.posix.join(
                            req.originalUrl + `/${workout[0].workoutid}`
                        )
                    )
                    .json(workout);
            }
        );
    });

workoutsRouter.route("/user").get(requireAuth, jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");

    WorkoutsService.getWorkoutByUserId(knexInstance, req.user.id)
        .then(workout => {
            if (!workout) {
                return res.status(404).json({
                    error: { message: "Cant find workouts" }
                });
            }
            res.json(workout);
        })
        .catch(next);
});

workoutsRouter
    .route("/:workout_id")
    .all(requireAuth)
    .get((req, res, next) => {
        const knexIntsance = req.app.get("db");
        WorkoutsService.getWorkoutById(knexIntsance, req.params.workout_id)
            .then(workout => {
                if (!workout) {
                    return res.status(404).json({
                        error: { message: `workout does not exist` }
                    });
                }
                res.json(workout);
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        WorkoutsService.deleteWorkoutById(
            req.app.get("db"),
            req.params.workout_id
        ).then(() => {
            res.status(204).end();
        });
    });

module.exports = workoutsRouter;
