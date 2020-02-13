function makeExercisesArray () {
    return [
        {
            exerciseid: 1,
            exercisename: "bench-press",
            sets: 3,
            repetitions: 10,
            exerciseweight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 1,
            userid: 1
        },
        {
            exerciseid: 2,
            exercisename: "clean",
            sets: 3,
            repetitions: 10,
            exerciseweight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 2,
            userid: 2
        },
        {
            exerciseid: 3,
            exercisename: "deadlift",
            sets: 3,
            repetitions: 10,
            exerciseweight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 3,
            userid: 3
        },
        {
            exerciseid: 4,
            exercisename: "squat",
            sets: 3,
            repetitions: 10,
            exerciseweight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 4,
            userid: 4
        }
    ]
}

module.exports = { makeExercisesArray }