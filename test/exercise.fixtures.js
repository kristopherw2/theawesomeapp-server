function makeExercisesArray () {
    return [
        {
            exerciseid: 1,
            exercisename: "bench-press",
            sets: 3,
            repetitions: 10,
            weight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 1
        },
        {
            exerciseid: 2,
            exercisename: "clean",
            sets: 3,
            repetitions: 10,
            weight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 2
        },
        {
            exerciseid: 3,
            exercisename: "deadlift",
            sets: 3,
            repetitions: 10,
            weight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 3
        },
        {
            exerciseid: 4,
            exercisename: "squat",
            sets: 3,
            repetitions: 10,
            weight: 200,
            time: 120,
            caloriesburned:100,
            workoutid: 4
        }
    ]
}

module.exports = { makeExercisesArray }